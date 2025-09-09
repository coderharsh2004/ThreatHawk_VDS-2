import os
import json
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from .utils.config import get_settings, validate_configuration
from .vectorstore.vector_service import SecurityReportVectorStore
from .chains.security_rag_chain import SecurityRAGChain
from .models.report_models import AnalysisRequest, AnalysisResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize settings
settings = get_settings()

# Validate configuration
validate_configuration()

# Initialize FastAPI app
app = FastAPI(
    title="Security RAG Agent API",
    description="RAG-based security analysis for NMAP and Web vulnerability reports",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances (will be initialized on startup)
vector_store: SecurityReportVectorStore = None
rag_chain: SecurityRAGChain = None

# Request/Response Models
class ReportUploadResponse(BaseModel):
    report_id: str
    report_type: str
    status: str
    message: str
    total_chunks: int

class ReportsListResponse(BaseModel):
    reports: List[Dict[str, Any]]
    total_count: int

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str
    vector_store_status: str
    llm_status: str

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    global vector_store, rag_chain
    
    try:
        logger.info("Initializing vector store...")
        vector_store = SecurityReportVectorStore(
            persist_directory=settings.chroma_db_path,
            embeddings_model=settings.embeddings_model,
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap
        )
        
        logger.info("Initializing RAG chain...")
        rag_chain = SecurityRAGChain(
            google_api_key=settings.google_api_key,
            vector_store=vector_store,
            model_name=settings.gemini_model,
            temperature=settings.model_temperature
        )
        
        logger.info("✓ All services initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
        raise

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    vector_store_status = "healthy" if vector_store else "not initialized"
    llm_status = "healthy" if rag_chain else "not initialized"
    simple_analyzer_status = "healthy" if simple_analyzer else "not initialized"
    
    overall_status = "healthy" if (vector_store and rag_chain and simple_analyzer) else "partial"
    
    return HealthResponse(
        status=overall_status,
        timestamp=datetime.now().isoformat(),
        version="1.0.0",
        vector_store_status=vector_store_status,
        llm_status=f"{llm_status}, simple_analyzer: {simple_analyzer_status}"
    )

# Report upload endpoints
@app.post("/upload/nmap", response_model=ReportUploadResponse)
async def upload_nmap_report(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="NMAP JSON report file")
):
    """Upload and process NMAP scan report"""
    if not file.filename.endswith('.json'):
        raise HTTPException(status_code=400, detail="Only JSON files are supported")
    
    try:
        # Read file content
        content = await file.read()
        nmap_data = json.loads(content.decode('utf-8'))
        
        # Validate basic NMAP structure
        if "hosts" not in nmap_data:
            raise HTTPException(status_code=400, detail="Invalid NMAP JSON format: 'hosts' field missing")
        
        # Add to vector store
        report_id = vector_store.add_report(nmap_data, "nmap", nmap_data.get("report_id"))
        
        # Calculate chunks (estimate)
        text_content = vector_store.process_json_to_text(nmap_data, "nmap")
        estimated_chunks = len(vector_store.text_splitter.split_text(text_content))
        
        logger.info(f"Successfully processed NMAP report {report_id}")
        
        return ReportUploadResponse(
            report_id=report_id,
            report_type="nmap",
            status="success",
            message=f"NMAP report processed successfully. Found {len(nmap_data['hosts'])} hosts.",
            total_chunks=estimated_chunks
        )
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    except Exception as e:
        logger.error(f"Error processing NMAP report: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing report: {str(e)}")

@app.post("/upload/web", response_model=ReportUploadResponse)
async def upload_web_report(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Web security JSON report file")
):
    """Upload and process web security scan report"""
    if not file.filename.endswith('.json'):
        raise HTTPException(status_code=400, detail="Only JSON files are supported")
    
    try:
        # Read file content
        content = await file.read()
        web_data = json.loads(content.decode('utf-8'))
        
        # Validate basic web security structure
        if "vulnerabilities" not in web_data:
            raise HTTPException(status_code=400, detail="Invalid web security JSON format: 'vulnerabilities' field missing")
        
        # Add to vector store
        report_id = vector_store.add_report(web_data, "web_security", web_data.get("report_id"))
        
        # Calculate chunks
        text_content = vector_store.process_json_to_text(web_data, "web_security")
        estimated_chunks = len(vector_store.text_splitter.split_text(text_content))
        
        logger.info(f"Successfully processed web security report {report_id}")
        
        return ReportUploadResponse(
            report_id=report_id,
            report_type="web_security",
            status="success",
            message=f"Web security report processed successfully. Found {len(web_data['vulnerabilities'])} vulnerabilities.",
            total_chunks=estimated_chunks
        )
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    except Exception as e:
        logger.error(f"Error processing web security report: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing report: {str(e)}")

# Fast Analysis endpoints (bypassing complex chains)
@app.post("/analyze/fast")
async def fast_comprehensive_analysis(request: AnalysisRequest):
    """Fast comprehensive analysis using direct Gemini calls"""
    try:
        # Get relevant documents from vector store
        search_results = vector_store.search_reports(request.query, k=3)
        context_docs = [doc.page_content for doc in search_results]
        
        if not context_docs:
            return {
                "query": request.query,
                "summary": "No relevant security data found for analysis.",
                "analysis_type": "fast_comprehensive",
                "timestamp": datetime.now().isoformat()
            }
        
        # Perform fast analysis
        result = simple_analyzer.comprehensive_analysis(request.query, context_docs)
        
        return {
            "query": request.query,
            "summary": result["summary"],
            "root_cause_analysis": result["root_cause"],
            "recommendations": result["recommendations"],
            "context_documents": len(context_docs),
            "analysis_type": "fast_comprehensive",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in fast analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Fast analysis failed: {str(e)}")

@app.post("/analyze/fast/root-cause")
async def fast_root_cause_analysis(request: AnalysisRequest):
    """Fast root cause analysis using direct Gemini calls"""
    try:
        # Get relevant documents
        search_results = vector_store.search_reports(request.query, k=3)
        context_docs = [doc.page_content for doc in search_results]
        
        if not context_docs:
            return {
                "query": request.query,
                "analysis": "No relevant security data found for root cause analysis.",
                "timestamp": datetime.now().isoformat()
            }
        
        # Perform fast root cause analysis
        analysis = simple_analyzer.root_cause_analysis(request.query, context_docs)
        
        return {
            "query": request.query,
            "analysis": analysis,
            "context_documents": len(context_docs),
            "analysis_type": "fast_root_cause",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in fast root cause analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Fast root cause analysis failed: {str(e)}")

@app.post("/analyze/fast/recommendations")
async def fast_recommendations(request: AnalysisRequest):
    """Fast recommendations using direct Gemini calls"""
    try:
        # Get relevant documents
        search_results = vector_store.search_reports(request.query, k=3)
        context_docs = [doc.page_content for doc in search_results]
        
        if not context_docs:
            return {
                "query": request.query,
                "recommendations": "No relevant security data found for generating recommendations.",
                "timestamp": datetime.now().isoformat()
            }
        
        # Generate fast recommendations
        recommendations = simple_analyzer.generate_recommendations(request.query, context_docs)
        
        return {
            "query": request.query,
            "recommendations": recommendations,
            "context_documents": len(context_docs),
            "analysis_type": "fast_recommendations",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in fast recommendations: {e}")
        raise HTTPException(status_code=500, detail=f"Fast recommendations failed: {str(e)}")

@app.get("/analyze/quick-assessment")
async def quick_security_assessment():
    """Quick overall security assessment of all reports"""
    try:
        # Get recent security data
        search_results = vector_store.search_reports("security vulnerability port", k=5)
        context_docs = [doc.page_content for doc in search_results]
        
        if not context_docs:
            return {
                "assessment": "No security data available for assessment.",
                "timestamp": datetime.now().isoformat()
            }
        
        # Perform quick assessment
        assessment = simple_analyzer.quick_security_assessment(context_docs)
        
        return {
            "assessment": assessment,
            "data_sources": len(context_docs),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in quick assessment: {e}")
        raise HTTPException(status_code=500, detail=f"Quick assessment failed: {str(e)}")

# Keep original endpoints but add fallback to fast analysis
@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_security_reports(request: AnalysisRequest):
    """Perform comprehensive security analysis using RAG (with fast fallback)"""
    try:
        # Try the original RAG chain first, but with a shorter timeout
        result = rag_chain.comprehensive_analysis(
            query=request.query,
            report_type=None
        )
        
        logger.info(f"Analysis completed for query: {request.query[:50]}...")
        return result
        
    except Exception as e:
        logger.error(f"Error in complex analysis, falling back to fast analysis: {e}")
        
        # Fallback to fast analysis
        try:
            search_results = vector_store.search_reports(request.query, k=3)
            context_docs = [doc.page_content for doc in search_results]
            
            if context_docs:
                fast_result = simple_analyzer.comprehensive_analysis(request.query, context_docs)
                
                # Convert to AnalysisResponse format
                return AnalysisResponse(
                    query=request.query,
                    summary=fast_result["summary"],
                    root_cause_analyses=[],
                    recommendations=[],
                    relevant_documents=[],
                    confidence_score=0.7
                )
            else:
                raise HTTPException(status_code=404, detail="No relevant security data found")
                
        except Exception as fallback_error:
            logger.error(f"Fallback analysis also failed: {fallback_error}")
            raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/analyze/root-cause")
async def analyze_root_cause(request: AnalysisRequest):
    """Perform root cause analysis"""
    try:
        result = rag_chain.perform_root_cause_analysis(
            query=request.query,
            report_type=None
        )
        
        return {
            "query": request.query,
            "analysis": result["analysis"],
            "context_documents": result["context_documents"],
            "source_chunks": result["source_chunks"],
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in root cause analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Root cause analysis failed: {str(e)}")

@app.post("/analyze/recommendations")
async def generate_recommendations(request: AnalysisRequest):
    """Generate security recommendations"""
    try:
        result = rag_chain.generate_recommendations(
            query=request.query,
            report_type=None
        )
        
        return {
            "query": request.query,
            "recommendations": result["recommendations"],
            "context_documents": result["context_documents"],
            "source_chunks": result["source_chunks"],
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail=f"Recommendation generation failed: {str(e)}")

@app.get("/search")
async def search_reports(
    query: str,
    report_type: Optional[str] = None,
    k: int = 5
):
    """Search through security reports"""
    try:
        if report_type and report_type not in ["nmap", "web_security"]:
            raise HTTPException(status_code=400, detail="report_type must be 'nmap' or 'web_security'")
        
        results = rag_chain.search_similar_issues(
            query=query,
            k=k,
            report_type=report_type
        )
        
        return {
            "query": query,
            "results": results,
            "total_results": len(results),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in search: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

# Report management endpoints
@app.get("/reports", response_model=ReportsListResponse)
async def list_reports():
    """List all stored reports"""
    try:
        # This would need to be implemented based on vector store capabilities
        # For now, return placeholder
        return ReportsListResponse(
            reports=[],
            total_count=0
        )
        
    except Exception as e:
        logger.error(f"Error listing reports: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list reports: {str(e)}")

@app.delete("/reports/{report_id}")
async def delete_report(report_id: str):
    """Delete a specific report"""
    try:
        vector_store.delete_report(report_id)
        return {
            "status": "success",
            "message": f"Report {report_id} deleted successfully",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error deleting report {report_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete report: {str(e)}")

@app.get("/reports/{report_id}/summary")
async def get_report_summary(report_id: str):
    """Get summary of a specific report"""
    try:
        summary = rag_chain.get_report_summary(report_id)
        return {
            "report_id": report_id,
            "summary": summary,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting summary for report {report_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get report summary: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
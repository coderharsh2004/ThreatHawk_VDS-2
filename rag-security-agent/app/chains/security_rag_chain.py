import os
from typing import List, Dict, Any, Optional
from datetime import datetime

from langchain.chains import RetrievalQA
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import Document
from langchain.callbacks import get_openai_callback
from langchain.prompts import ChatPromptTemplate

from ..vectorstore.vector_service import SecurityReportVectorStore
from ..prompts.security_prompts import (
    ROOT_CAUSE_ANALYSIS_PROMPT,
    RECOMMENDATION_PROMPT,
    VULNERABILITY_SUMMARY_PROMPT,
    QUERY_CLASSIFICATION_PROMPT
)
from ..models.report_models import AnalysisResponse, RootCauseAnalysis, RecommendationItem


class SecurityRAGChain:
    """
    RAG chain for security analysis using Gemini and vector search
    """
    
    def __init__(self, 
                 google_api_key: str,
                 vector_store: SecurityReportVectorStore,
                 model_name: str = "gemini-2.5-flash",
                 temperature: float = 0.1):
        
        self.vector_store = vector_store
        
        # Initialize Gemini LLM
        self.llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=google_api_key,
            temperature=temperature,
            convert_system_message_to_human=True  # Gemini compatibility
        )
        
        # Initialize different analysis chains
        self._setup_chains()
    
    def _setup_chains(self):
        """Setup different analysis chains for various query types"""
        
        # Root cause analysis chain
        self.root_cause_chain = create_stuff_documents_chain(
            llm=self.llm,
            prompt=ROOT_CAUSE_ANALYSIS_PROMPT
        )
        
        # Recommendation chain  
        self.recommendation_chain = create_stuff_documents_chain(
            llm=self.llm,
            prompt=RECOMMENDATION_PROMPT
        )
        
        # Create full retrieval chains
        self.root_cause_rag_chain = create_retrieval_chain(
            retriever=self.vector_store.get_retriever(k=5),
            combine_docs_chain=self.root_cause_chain
        )
        
        self.recommendation_rag_chain = create_retrieval_chain(
            retriever=self.vector_store.get_retriever(k=5),
            combine_docs_chain=self.recommendation_chain
        )
    
    def classify_query(self, query: str) -> Dict[str, Any]:
        """
        Classify the user query to determine analysis type
        """
        try:
            classification_prompt = QUERY_CLASSIFICATION_PROMPT.format(query=query)
            response = self.llm.invoke(classification_prompt)
            
            # Parse classification (simple keyword matching for now)
            content = response.content.lower()
            categories = []
            
            if any(word in content for word in ["root_cause", "cause", "why", "reason"]):
                categories.append("root_cause")
            if any(word in content for word in ["recommendation", "fix", "remediate", "solution"]):
                categories.append("recommendation") 
            if any(word in content for word in ["risk", "assessment", "impact"]):
                categories.append("risk_assessment")
            if any(word in content for word in ["technical", "details", "how"]):
                categories.append("technical_details")
                
            return {
                "categories": categories if categories else ["general"],
                "raw_classification": response.content
            }
            
        except Exception as e:
            print(f"Error in query classification: {e}")
            return {"categories": ["general"], "raw_classification": ""}
    
    def perform_root_cause_analysis(self, query: str, report_type: Optional[str] = None) -> Dict[str, Any]:
        """
        Perform root cause analysis using RAG
        """
        try:
            # Get relevant documents
            retriever = self.vector_store.get_retriever(k=5, report_type=report_type)
            
            # Run the RAG chain
            result = self.root_cause_rag_chain.invoke({
                "input": query
            })
            
            # Extract context documents for reference
            context_docs = result.get("context", [])
            
            return {
                "analysis": result.get("answer", ""),
                "context_documents": [doc.metadata.get("report_id") for doc in context_docs],
                "source_chunks": len(context_docs)
            }
            
        except Exception as e:
            print(f"Error in root cause analysis: {e}")
            return {"analysis": f"Error performing analysis: {str(e)}", "context_documents": []}
    
    def generate_recommendations(self, query: str, root_cause_analysis: str = "", report_type: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate security recommendations using RAG
        """
        try:
            # Get relevant documents  
            retriever = self.vector_store.get_retriever(k=5, report_type=report_type)
            
            # Prepare input with root cause context
            input_data = {
                "input": query,
                "root_cause": root_cause_analysis
            }
            
            # Run the recommendation chain
            result = self.recommendation_rag_chain.invoke(input_data)
            
            context_docs = result.get("context", [])
            
            return {
                "recommendations": result.get("answer", ""),
                "context_documents": [doc.metadata.get("report_id") for doc in context_docs],
                "source_chunks": len(context_docs)
            }
            
        except Exception as e:
            print(f"Error generating recommendations: {e}")
            return {"recommendations": f"Error generating recommendations: {str(e)}", "context_documents": []}
    
    def comprehensive_analysis(self, query: str, report_type: Optional[str] = None) -> AnalysisResponse:
        """
        Perform comprehensive security analysis combining multiple chain types
        """
        try:
            # Classify query
            classification = self.classify_query(query)
            analysis_types = classification["categories"]
            
            # Initialize response components
            summary_parts = []
            root_cause_analyses = []
            recommendations = []
            relevant_documents = set()
            confidence_score = 0.0
            
            # Always perform both root cause and recommendations for comprehensive analysis
            print(f"Performing comprehensive analysis for: {query}")
            
            # Perform root cause analysis
            print("Running root cause analysis...")
            root_cause_result = self.perform_root_cause_analysis(query, report_type)
            if root_cause_result['analysis'] and "Error" not in root_cause_result['analysis']:
                summary_parts.append(f"**Root Cause Analysis:**\n{root_cause_result['analysis'][:300]}...")
                relevant_documents.update(root_cause_result['context_documents'])
                
                # Create structured root cause analysis
                root_cause_analyses.append(RootCauseAnalysis(
                    vulnerability_id="general_analysis",
                    root_cause=root_cause_result['analysis'][:200] + "..." if len(root_cause_result['analysis']) > 200 else root_cause_result['analysis'],
                    attack_vector="Multiple vectors identified from scan data",
                    business_impact="Potential security risks identified",
                    technical_details=root_cause_result['analysis'],
                    confidence_score=0.8
                ))
            
            # Generate recommendations
            print("Generating recommendations...")
            rec_result = self.generate_recommendations(query, "", report_type)
            if rec_result['recommendations'] and "Error" not in rec_result['recommendations']:
                summary_parts.append(f"\n**Security Recommendations:**\n{rec_result['recommendations'][:300]}...")
                relevant_documents.update(rec_result['context_documents'])
                
                # Create structured recommendations
                recommendations.append(RecommendationItem(
                    priority="high",
                    action="Implement security controls based on scan findings",
                    description=rec_result['recommendations'][:200] + "..." if len(rec_result['recommendations']) > 200 else rec_result['recommendations'],
                    estimated_effort="medium",
                    resources_required=["Security team", "System administrators"]
                ))
            
            # Create comprehensive summary
            if summary_parts:
                summary = "\n".join(summary_parts)
            else:
                # Fallback: create summary from search results
                search_results = self.vector_store.search_reports(query, k=3, report_type=report_type)
                if search_results:
                    context_text = "\n".join([doc.page_content[:100] for doc in search_results])
                    summary_prompt = f"Based on these security findings, provide a brief analysis summary:\n{context_text}\n\nQuery: {query}"
                    summary_response = self.llm.invoke(summary_prompt)
                    summary = summary_response.content
                    relevant_documents.update([doc.metadata.get("report_id") for doc in search_results if doc.metadata.get("report_id")])
                else:
                    summary = "No relevant security data found for the query."
            
            # Calculate confidence score
            confidence_score = min(0.9, len(relevant_documents) * 0.2 + 0.4)
            
            print(f"Analysis completed. Summary length: {len(summary)}")
            
            return AnalysisResponse(
                query=query,
                summary=summary,
                root_cause_analyses=root_cause_analyses,
                recommendations=recommendations,
                relevant_documents=list(relevant_documents),
                confidence_score=confidence_score
            )
            
        except Exception as e:
            print(f"Error in comprehensive analysis: {e}")
            return AnalysisResponse(
                query=query,
                summary=f"Error performing comprehensive analysis: {str(e)}",
                root_cause_analyses=[],
                recommendations=[],
                relevant_documents=[],
                confidence_score=0.0
            )
    
    def search_similar_issues(self, query: str, k: int = 5, report_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Search for similar security issues in the knowledge base
        """
        try:
            results = self.vector_store.search_with_score(query, k=k, report_type=report_type)
            
            similar_issues = []
            for doc, score in results:
                similar_issues.append({
                    "content": doc.page_content,
                    "similarity_score": float(score),
                    "report_id": doc.metadata.get("report_id"),
                    "report_type": doc.metadata.get("report_type"),
                    "chunk_index": doc.metadata.get("chunk_index", 0)
                })
            
            return similar_issues
            
        except Exception as e:
            print(f"Error searching similar issues: {e}")
            return []
    
    def get_report_summary(self, report_id: str) -> str:
        """
        Generate a summary for a specific report
        """
        try:
            # Search for all chunks of this report
            results = self.vector_store.search_reports(
                query="summary overview", 
                k=20  # Get more chunks to cover the full report
            )
            
            # Filter for the specific report
            report_chunks = [
                doc for doc in results 
                if doc.metadata.get("report_id") == report_id
            ]
            
            if not report_chunks:
                return "Report not found"
            
            # Combine chunks and generate summary
            combined_content = "\n".join([doc.page_content for doc in report_chunks])
            
            summary_prompt = VULNERABILITY_SUMMARY_PROMPT.format(
                vulnerabilities=combined_content,
                query="Provide a comprehensive summary of this security report"
            )
            
            response = self.llm.invoke(summary_prompt)
            return response.content
            
        except Exception as e:
            print(f"Error generating report summary: {e}")
            return f"Error generating summary: {str(e)}"
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

class SeverityLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

# Nmap Report Models
class NmapPort(BaseModel):
    port: int
    protocol: str = "tcp"
    state: str
    service: Optional[str] = None
    version: Optional[str] = None
    product: Optional[str] = None
    extra_info: Optional[str] = None

class NmapHost(BaseModel):
    ip: str
    hostname: Optional[str] = None
    status: str = "up"
    os: Optional[str] = None
    ports: List[NmapPort] = []
    mac_address: Optional[str] = None

class NmapScanInfo(BaseModel):
    scan_type: str
    protocol: str
    num_services: int
    services: str

class NmapReport(BaseModel):
    scan_info: NmapScanInfo
    hosts: List[NmapHost]
    scan_stats: Dict[str, Any] = {}
    timestamp: datetime = Field(default_factory=datetime.now)

# Web-based Security Report Models
class Vulnerability(BaseModel):
    id: str
    title: str
    description: str
    severity: SeverityLevel
    cvss_score: Optional[float] = None
    cve_ids: List[str] = []
    affected_urls: List[str] = []
    recommendation: Optional[str] = None
    references: List[str] = []

class WebScanTarget(BaseModel):
    url: str
    domain: str
    ip: Optional[str] = None
    technologies: List[str] = []

class WebSecurityReport(BaseModel):
    target: WebScanTarget
    scan_date: datetime
    scan_duration: Optional[int] = None  # in seconds
    vulnerabilities: List[Vulnerability]
    summary: Dict[str, int] = {}  # severity counts
    scanner_info: Optional[Dict[str, str]] = None

# Unified Report Model for RAG Processing
class SecurityReportDocument(BaseModel):
    id: str
    report_type: str  # "nmap" or "web_security"
    source_data: Union[NmapReport, WebSecurityReport]
    processed_content: str  # Text representation for vector storage
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.now)

# Request/Response Models for API
class AnalysisRequest(BaseModel):
    query: str
    report_ids: Optional[List[str]] = None  # Specific reports to analyze
    include_recommendations: bool = True
    max_results: int = Field(default=5, ge=1, le=20)

class RootCauseAnalysis(BaseModel):
    vulnerability_id: str
    root_cause: str
    attack_vector: str
    business_impact: str
    technical_details: str
    confidence_score: float = Field(ge=0.0, le=1.0)

class RecommendationItem(BaseModel):
    priority: SeverityLevel
    action: str
    description: str
    estimated_effort: str  # "low", "medium", "high"
    resources_required: List[str] = []

class AnalysisResponse(BaseModel):
    query: str
    summary: str
    root_cause_analyses: List[RootCauseAnalysis] = []
    recommendations: List[RecommendationItem] = []
    relevant_documents: List[str] = []  # Document IDs
    confidence_score: float = Field(ge=0.0, le=1.0)
    generated_at: datetime = Field(default_factory=datetime.now)
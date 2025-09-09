import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain.schema import BaseRetriever

import chromadb
from chromadb.config import Settings


class SecurityReportVectorStore:
    """
    Vector store for security reports with flexible JSON processing.
    Designed to adapt to actual JSON formats once samples are provided.
    """

    def __init__(
        self,
        persist_directory: str = "./chroma_db",
        embeddings_model: str = "sentence-transformers/all-MiniLM-L6-v2",
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ):
        self.persist_directory = persist_directory
        self.embeddings = HuggingFaceEmbeddings(model_name=embeddings_model)
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

        # Initialize text splitter
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""],
        )

        # Initialize ChromaDB client
        self.chroma_client = chromadb.PersistentClient(
            path=persist_directory, settings=Settings(anonymized_telemetry=False)
        )

        # Initialize collections
        self.nmap_collection = "nmap_reports"
        self.web_collection = "web_security_reports"

        # Initialize vector store
        self.vector_store = None
        self._initialize_vector_store()

    def _initialize_vector_store(self):
        """Initialize the ChromaDB vector store"""
        try:
            self.vector_store = Chroma(
                client=self.chroma_client,
                collection_name="security_reports",
                embedding_function=self.embeddings,
                persist_directory=self.persist_directory,
            )
        except Exception as e:
            print(f"Error initializing vector store: {e}")
            # Create new vector store if none exists
            self.vector_store = Chroma(
                embedding_function=self.embeddings,
                persist_directory=self.persist_directory,
                collection_name="security_reports",
            )

    def process_json_to_text(self, json_data: Dict[str, Any], report_type: str) -> str:
        """Convert JSON report to searchable text format."""
        if report_type == "nmap":
            return self._process_nmap_json(json_data)
        elif report_type == "web_security":
            return self._process_web_security_json(json_data)
        else:
            return self._process_generic_json(json_data)

    def _process_nmap_json(self, nmap_data: Dict[str, Any]) -> str:
        text_parts = ["NMAP Scan Report"]

        if "hosts" in nmap_data:
            for host in nmap_data.get("hosts", []):
                host_info = f"Host: {host.get('ip', 'unknown')}"
                if "ports" in host:
                    ports_info = []
                    for port in host["ports"]:
                        port_desc = f"Port {port.get('port', 'unknown')} ({port.get('state', 'unknown')})"
                        if port.get("service"):
                            port_desc += f" Service: {port['service']}"
                        ports_info.append(port_desc)
                    host_info += f" Ports: {', '.join(ports_info)}"
                text_parts.append(host_info)

        text_parts.append(f"Scan Date: {datetime.now().isoformat()}")
        return "\n".join(text_parts)

    def _process_web_security_json(self, web_data: Dict[str, Any]) -> str:
        text_parts = []
        report_id = web_data.get("report_id", "unknown")
        scan_type = web_data.get("scan_type", "web_security")
        text_parts.append(f"Web Security Scan Report ID: {report_id}")
        text_parts.append(f"Scan Type: {scan_type}")
        text_parts.append(f"Deep Scan: {'Yes' if web_data.get('is_deep', False) else 'No'}")

        summary = web_data.get("summary", {})
        total_vulns = web_data.get("total_vulnerabilities", 0)
        text_parts.append(f"Total Vulnerabilities Found: {total_vulns}")

        severity_breakdown = []
        for severity in ["high", "medium", "low", "informational"]:
            count = summary.get(severity, 0)
            if count > 0:
                severity_breakdown.append(f"{count} {severity}")

        if severity_breakdown:
            text_parts.append(f"Severity Breakdown: {', '.join(severity_breakdown)}")

        false_positives = summary.get("false_positives", 0)
        if false_positives > 0:
            text_parts.append(f"False Positives: {false_positives}")

        vulnerabilities = web_data.get("vulnerabilities", [])
        if vulnerabilities:
            text_parts.append("\nVulnerabilities Found:")
            for vuln in vulnerabilities:
                vuln_name = vuln.get("name", "Unknown Vulnerability")
                severity = vuln.get("severity", "Unknown")
                instance_count = vuln.get("instance_count", 1)

                vuln_text = f"- {vuln_name} (Severity: {severity})"
                if instance_count > 1:
                    vuln_text += f" - Found in {instance_count} instances"

                text_parts.append(vuln_text)

                description = vuln.get("description", "")
                if description:
                    desc_preview = description[:200] + "..." if len(description) > 200 else description
                    text_parts.append(f"  Description: {desc_preview}")

                solution = vuln.get("solution", "")
                if solution:
                    solution_preview = solution[:150] + "..." if len(solution) > 150 else solution
                    text_parts.append(f"  Solution: {solution_preview}")

                example_instance = vuln.get("example_instance", {})
                if example_instance and isinstance(example_instance, dict) and example_instance:
                    text_parts.append(f"  Example instance details available")

        if web_data.get("report_path"):
            text_parts.append(f"Report Path: {web_data['report_path']}")

        scan_type_full = web_data.get("scan_type_full", "")
        if scan_type_full:
            text_parts.append(f"Full Scan Type: {scan_type_full}")

        return "\n".join(text_parts)

    def _process_generic_json(self, json_data: Dict[str, Any]) -> str:
        """Fallback generic JSON to text conversion"""

        def json_to_text(obj, prefix=""):
            if isinstance(obj, dict):
                texts = []
                for key, value in obj.items():
                    if isinstance(value, (dict, list)):
                        texts.append(json_to_text(value, f"{prefix}{key}: "))
                    else:
                        texts.append(f"{prefix}{key}: {value}")
                return "\n".join(texts)
            elif isinstance(obj, list):
                texts = []
                for i, item in enumerate(obj):
                    texts.append(json_to_text(item, f"{prefix}[{i}] "))
                return "\n".join(texts)
            else:
                return str(obj)

        return json_to_text(json_data)

    def add_report(self, json_data: Dict[str, Any], report_type: str, report_id: Optional[str] = None) -> str:
        if not report_id:
            report_id = str(uuid.uuid4())

        text_content = self.process_json_to_text(json_data, report_type)
        chunks = self.text_splitter.split_text(text_content)

        documents = []
        for i, chunk in enumerate(chunks):
            doc = Document(
                page_content=chunk,
                metadata={
                    "report_id": report_id,
                    "report_type": report_type,
                    "chunk_index": i,
                    "total_chunks": len(chunks),
                    "created_at": datetime.now().isoformat(),
                    "original_json": json.dumps(json_data),
                },
            )
            documents.append(doc)

        self.vector_store.add_documents(documents)
        return report_id

    def search_reports(self, query: str, k: int = 5, report_type: Optional[str] = None) -> List[Document]:
        filter_dict = {}
        if report_type:
            filter_dict["report_type"] = report_type

        results = self.vector_store.similarity_search(
            query, k=k, filter=filter_dict if filter_dict else None
        )
        return results

    def search_with_score(
        self, query: str, k: int = 5, report_type: Optional[str] = None
    ) -> List[tuple]:
        filter_dict = {}
        if report_type:
            filter_dict["report_type"] = report_type

        results = self.vector_store.similarity_search_with_score(
            query, k=k, filter=filter_dict if filter_dict else None
        )
        return results

    def get_retriever(self, k: int = 5, report_type: Optional[str] = None) -> BaseRetriever:
        search_kwargs = {"k": k}
        if report_type:
            search_kwargs["filter"] = {"report_type": report_type}

        return self.vector_store.as_retriever(search_kwargs=search_kwargs)

    def delete_report(self, report_id: str):
        self.vector_store.delete(where={"report_id": report_id})

    def get_report_ids(self, report_type: Optional[str] = None) -> List[str]:
        # Needs to be implemented later with collection querying
        return []

    def update_processing_logic(self, nmap_processor=None, web_processor=None):
        if nmap_processor:
            self._process_nmap_json = nmap_processor
        if web_processor:
            self._process_web_security_json = web_processor

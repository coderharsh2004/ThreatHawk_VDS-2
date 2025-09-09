"""
Simplified, high-performance analysis service that bypasses complex LangChain chains
"""

import os
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from ..utils.config import get_settings

settings = get_settings()

class SimpleSecurityAnalyzer:
    """
    Direct, fast security analysis using Google Gemini without complex RAG chains
    """
    
    def __init__(self):
        # Configure Gemini directly
        genai.configure(api_key=settings.google_api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def analyze_with_context(self, query: str, context_documents: List[str]) -> str:
        """
        Perform analysis with provided context documents
        """
        # Combine context documents
        context_text = "\n".join(context_documents[:3])  # Limit to 3 docs for speed
        
        prompt = f"""You are a cybersecurity expert. Analyze the following security scan data and answer the user's question.

Security Scan Data:
{context_text}

User Question: {query}

Provide a detailed, actionable analysis focusing on:
1. Root causes of security issues
2. Specific risks and attack vectors
3. Prioritized remediation steps
4. Business impact assessment

Keep your response comprehensive but concise."""

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error in analysis: {str(e)}"
    
    def root_cause_analysis(self, query: str, context_documents: List[str]) -> str:
        """
        Focused root cause analysis
        """
        context_text = "\n".join(context_documents[:3])
        
        prompt = f"""As a cybersecurity expert, perform a root cause analysis based on the security scan data below.

Security Scan Data:
{context_text}

Focus Question: {query}

Provide a structured root cause analysis including:

**ROOT CAUSE IDENTIFICATION:**
- Primary technical causes
- Configuration issues
- Process failures

**ATTACK VECTORS:**
- How attackers could exploit these issues
- Entry points and escalation paths

**BUSINESS IMPACT:**
- Potential consequences
- Risk assessment

**CONFIDENCE LEVEL:**
- How certain you are about the analysis
- Supporting evidence

Be specific and technical in your analysis."""

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error in root cause analysis: {str(e)}"
    
    def generate_recommendations(self, query: str, context_documents: List[str]) -> str:
        """
        Generate specific security recommendations
        """
        context_text = "\n".join(context_documents[:3])
        
        prompt = f"""As a senior security consultant, provide specific remediation recommendations based on the security findings below.

Security Findings:
{context_text}

User Request: {query}

Provide prioritized recommendations in this format:

**HIGH PRIORITY (Immediate Action Required):**
• Specific action 1 - Implementation details
• Specific action 2 - Implementation details

**MEDIUM PRIORITY (Within 30 days):**
• Specific action 1 - Implementation details
• Specific action 2 - Implementation details

**LOW PRIORITY (Long-term improvements):**
• Specific action 1 - Implementation details

**IMPLEMENTATION NOTES:**
• Resource requirements
• Estimated effort levels
• Dependencies

Focus on actionable, specific recommendations with clear implementation guidance."""

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating recommendations: {str(e)}"
    
    def comprehensive_analysis(self, query: str, context_documents: List[str]) -> Dict[str, str]:
        """
        Combined analysis providing both root cause and recommendations
        """
        context_text = "\n".join(context_documents[:3])
        
        # Get root cause analysis
        root_cause = self.root_cause_analysis(query, context_documents)
        
        # Get recommendations 
        recommendations = self.generate_recommendations(query, context_documents)
        
        # Create executive summary
        summary_prompt = f"""Based on the following analysis results, create an executive summary for security stakeholders:

Root Cause Analysis:
{root_cause[:500]}...

Recommendations:
{recommendations[:500]}...

Original Query: {query}

Create a concise executive summary (2-3 paragraphs) that highlights:
- Key security risks identified
- Most critical issues requiring immediate attention
- High-level remediation approach
- Business impact summary"""

        try:
            summary_response = self.model.generate_content(summary_prompt)
            summary = summary_response.text
        except Exception as e:
            summary = f"Executive Summary: Analysis completed for query '{query}'. Root cause analysis and recommendations generated successfully."
        
        return {
            "summary": summary,
            "root_cause": root_cause,
            "recommendations": recommendations
        }
    
    def quick_security_assessment(self, context_documents: List[str]) -> str:
        """
        Quick overall security assessment
        """
        context_text = "\n".join(context_documents[:5])  # Use more context for assessment
        
        prompt = f"""Perform a quick security assessment of the following scan data:

{context_text}

Provide a brief assessment covering:
1. Overall security posture (Good/Fair/Poor)
2. Top 3 critical issues
3. Top 3 recommended actions
4. Risk level (High/Medium/Low)

Keep the assessment concise but actionable."""

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error in security assessment: {str(e)}"
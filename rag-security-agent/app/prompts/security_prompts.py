from langchain.prompts import PromptTemplate, ChatPromptTemplate
from langchain.prompts.few_shot import FewShotPromptTemplate

# Root Cause Analysis Prompt
ROOT_CAUSE_ANALYSIS_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a cybersecurity expert specializing in vulnerability analysis and root cause identification. 
    Analyze the provided security scan data to identify root causes of vulnerabilities and security issues.
    
    Your analysis should be:
    1. Technical and precise
    2. Based on industry standards and best practices
    3. Include specific attack vectors
    4. Assess business impact
    5. Provide confidence scores based on evidence strength
    
    Format your response as structured analysis with clear sections."""),
    
    ("human", """Based on the following security scan data, perform a root cause analysis:

Context Information:
{context}

User Query: {input}

Specific focus areas:
- Identify the underlying technical causes
- Determine potential attack vectors  
- Assess business impact and risk level
- Provide evidence-based confidence scores

Please provide a comprehensive root cause analysis.""")
])

# Recommendation Generation Prompt
RECOMMENDATION_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a senior security consultant providing actionable remediation recommendations.
    Your recommendations should be:
    1. Prioritized by risk and impact
    2. Specific and actionable
    3. Include effort estimates
    4. Consider business constraints
    5. Follow industry best practices (OWASP, NIST, etc.)
    
    Provide recommendations in order of priority with clear implementation guidance."""),
    
    ("human", """Based on the security analysis below, provide prioritized remediation recommendations:

Security Context:
{context}

Root Cause Analysis:
{root_cause}

Query: {input}

Please provide:
1. Immediate actions (high priority)
2. Medium-term improvements
3. Long-term security enhancements
4. Resource requirements for each recommendation""")
])

# Vulnerability Summary Prompt  
VULNERABILITY_SUMMARY_PROMPT = PromptTemplate(
    input_variables=["vulnerabilities", "query"],
    template="""Analyze the following vulnerabilities and provide a concise summary:

Vulnerabilities Found:
{vulnerabilities}

User Question: {query}

Please provide:
1. Executive summary of key risks
2. Most critical vulnerabilities requiring immediate attention
3. Common themes or patterns in the findings
4. Overall security posture assessment

Keep the summary focused and actionable for both technical and business stakeholders."""
)

# Few-shot examples for better context understanding
NMAP_ANALYSIS_EXAMPLES = [
    {
        "input": "Open port 22 with SSH service on production server",
        "output": """Root Cause: SSH service exposed on default port without apparent access controls.
Attack Vector: Brute force attacks, credential stuffing, SSH key compromise.
Business Impact: Potential unauthorized access to production systems, data breach risk.
Recommendation: Implement SSH key-based authentication, change default port, configure fail2ban."""
    },
    {
        "input": "Multiple high ports open with unknown services",
        "output": """Root Cause: Unmanaged services running on non-standard ports, lack of port inventory.
Attack Vector: Service exploitation, reconnaissance for further attacks.
Business Impact: Expanded attack surface, potential backdoors or malware.
Recommendation: Audit all running services, implement port scanning policies, close unnecessary ports."""
    }
]

NMAP_FEW_SHOT_PROMPT = FewShotPromptTemplate(
    examples=NMAP_ANALYSIS_EXAMPLES,
    example_prompt=PromptTemplate(
        input_variables=["input", "output"],
        template="Scan Finding: {input}\nAnalysis: {output}"
    ),
    prefix="Here are examples of network scan analysis:\n",
    suffix="\nNow analyze this scan finding:\nScan Finding: {input}\nAnalysis:",
    input_variables=["input"]
)

# Web Security Analysis Examples
WEB_SECURITY_EXAMPLES = [
    {
        "input": "SQL injection vulnerability in login form",
        "output": """Root Cause: Insufficient input validation and parameterized queries not implemented.
Attack Vector: Database manipulation, data extraction, authentication bypass.
Business Impact: Data breach, customer data exposure, regulatory violations.
Recommendation: Implement parameterized queries, input validation, Web Application Firewall."""
    },
    {
        "input": "Cross-site scripting (XSS) in user comments",
        "output": """Root Cause: Lack of output encoding and content security policy.
Attack Vector: Session hijacking, credential theft, malware distribution.
Business Impact: User account compromise, reputation damage, legal liability.
Recommendation: Implement output encoding, Content Security Policy, regular security testing."""
    }
]

WEB_SECURITY_FEW_SHOT_PROMPT = FewShotPromptTemplate(
    examples=WEB_SECURITY_EXAMPLES,
    example_prompt=PromptTemplate(
        input_variables=["input", "output"],
        template="Vulnerability: {input}\nAnalysis: {output}"
    ),
    prefix="Here are examples of web security analysis:\n",
    suffix="\nNow analyze this vulnerability:\nVulnerability: {input}\nAnalysis:",
    input_variables=["input"]
)

# Query Classification Prompt
QUERY_CLASSIFICATION_PROMPT = PromptTemplate(
    input_variables=["query"],
    template="""Classify the following security-related query into one or more categories:

Categories:
- root_cause: Asking about underlying causes of vulnerabilities
- recommendation: Seeking remediation advice
- risk_assessment: Evaluating security posture or risk levels
- technical_details: Requesting technical information about findings
- compliance: Questions about regulatory compliance
- threat_modeling: Analyzing potential threats and attack scenarios

Query: {query}

Classification: """
)

# Context Retrieval Prompt for RAG
CONTEXT_RETRIEVAL_PROMPT = PromptTemplate(
    input_variables=["query", "report_type"],
    template="""Generate effective search terms for retrieving relevant security scan data.

User Query: {query}
Report Type: {report_type}

Generate 3-5 search terms that would help find the most relevant security findings:
1. Primary keywords from the query
2. Technical terms related to the security domain
3. Synonyms and related concepts

Search Terms:"""
)
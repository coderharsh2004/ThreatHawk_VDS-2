#!/usr/bin/env python3
"""
Direct test of Gemini API to measure response times
"""

import os
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def test_gemini_performance():
    """Test Gemini API performance directly"""
    print("🧪 Testing Gemini API Performance")
    print("=" * 40)
    
    # Configure API
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ GOOGLE_API_KEY not found in environment")
        return
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    # Test with different query complexities
    tests = [
        {
            "name": "Simple Query",
            "prompt": "What are the security risks of having SSH port 22 open?"
        },
        {
            "name": "Medium Complexity",
            "prompt": """Analyze these security findings:
            - Port 22 (SSH) is open
            - Port 80 (HTTP) is open
            - Port 443 (HTTPS) is open
            - Port 3000 is open
            
            What are the main security risks?"""
        },
        {
            "name": "Complex Analysis",
            "prompt": """Perform a security analysis on this NMAP data:
            Host: 15.207.189.161 (futics.org)
            Open Ports: 22/tcp (SSH), 80/tcp (HTTP), 443/tcp (HTTPS), 3000/tcp
            
            Provide:
            1. Risk assessment
            2. Root cause analysis
            3. Specific recommendations
            4. Priority levels"""
        }
    ]
    
    for test in tests:
        print(f"\n🔍 Testing: {test['name']}")
        start_time = time.time()
        
        try:
            response = model.generate_content(test['prompt'])
            elapsed = time.time() - start_time
            
            print(f"✅ Response in {elapsed:.1f}s")
            print(f"Preview: {response.text[:100]}...")
            
            if elapsed > 20:
                print("⚠️ Response time is slow (>20s)")
            elif elapsed > 10:
                print("⚠️ Response time is moderate (>10s)")
            else:
                print("✅ Good response time")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 40)
    print("📊 Performance Summary:")
    print("• <5s: Excellent")
    print("• 5-10s: Good")  
    print("• 10-20s: Acceptable")
    print("• >20s: Slow (may cause timeouts)")

if __name__ == "__main__":
    test_gemini_performance()
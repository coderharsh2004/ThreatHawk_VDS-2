#!/usr/bin/env python3
"""
Diagnostic script to identify performance bottlenecks
"""

import requests
import time
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "http://localhost:8000"

def test_google_api_directly():
    """Test Google Gemini API directly"""
    print("🔍 Testing Google Gemini API directly...")
    
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        print("❌ Google API key not set properly")
        return False
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        start_time = time.time()
        response = model.generate_content("What are common security risks of open port 22?")
        elapsed = time.time() - start_time
        
        print(f"✅ Direct API call successful in {elapsed:.1f}s")
        print(f"Response preview: {response.text[:100]}...")
        return True
        
    except Exception as e:
        print(f"❌ Direct API call failed: {e}")
        return False

def test_basic_endpoints():
    """Test basic API endpoints"""
    print("\n🔍 Testing basic endpoints...")
    
    # Health check
    try:
        start_time = time.time()
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        elapsed = time.time() - start_time
        if response.status_code == 200:
            print(f"✅ Health check: {elapsed:.1f}s")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False
    
    # Search endpoint (should be fast)
    try:
        start_time = time.time()
        response = requests.get(f"{BASE_URL}/search", params={
            "query": "port 22",
            "k": 2
        }, timeout=10)
        elapsed = time.time() - start_time
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Search: {elapsed:.1f}s, found {data.get('total_results', 0)} results")
        else:
            print(f"❌ Search failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Search error: {e}")
    
    return True

def test_server_logs():
    """Provide instructions for checking server logs"""
    print("\n📋 Server Diagnostics:")
    print("1. Check your server terminal for error messages")
    print("2. Look for ChromaDB initialization errors")
    print("3. Check for Google API authentication errors")
    print("4. Monitor memory usage (vector operations can be memory-intensive)")
    
    print("\n🔧 Common Issues & Solutions:")
    print("• API Key: Ensure GOOGLE_API_KEY is set correctly in .env")
    print("• ChromaDB: Delete ./chroma_db folder and restart if corrupted")
    print("• Memory: Restart server if memory usage is high")
    print("• Embedding Model: First-time download might be slow")

def create_lightweight_test_endpoint():
    """Create a simple test to isolate the issue"""
    print("\n🧪 Testing minimal functionality...")
    
    # Test a simple query that bypasses complex chains
    try:
        start_time = time.time()
        response = requests.get(f"{BASE_URL}/search", params={
            "query": "security",
            "k": 1
        }, timeout=5)
        elapsed = time.time() - start_time
        
        if response.status_code == 200:
            print(f"✅ Basic vector search works: {elapsed:.1f}s")
            return True
        else:
            print(f"❌ Basic search failed: {response.status_code}")
            print("This suggests vector store or embedding issues")
            return False
            
    except Exception as e:
        print(f"❌ Basic search error: {e}")
        return False

def main():
    print("🔧 Security RAG Agent - Performance Diagnostics")
    print("=" * 60)
    
    # Test 1: Google API directly
    if not test_google_api_directly():
        print("\n❌ Google API issues detected. Please check your API key.")
        return
    
    # Test 2: Basic endpoints
    if not test_basic_endpoints():
        print("\n❌ Basic API issues detected. Please check server status.")
        return
    
    # Test 3: Vector search
    if not create_lightweight_test_endpoint():
        print("\n❌ Vector store issues detected.")
        return
    
    print("\n" + "=" * 60)
    print("🎯 DIAGNOSIS COMPLETE")
    print("\n✅ All basic components work individually")
    print("❌ The issue is likely in the RAG chain complexity")
    print("\n🚀 RECOMMENDED SOLUTION:")
    print("Let me create a simplified, faster version of the analysis endpoints")
    print("that bypasses the complex LangChain retrieval chains.")

if __name__ == "__main__":
    main()
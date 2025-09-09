#!/usr/bin/env python3
"""
Test script for the new fast analysis endpoints
"""

import requests
import time
import json

BASE_URL = "http://localhost:8000"

def test_fast_endpoints():
    """Test the new fast analysis endpoints"""
    print("🚀 Testing Fast Analysis Endpoints")
    print("=" * 50)
    
    # Test 1: Quick Assessment (no query required)
    print("\n📊 Testing Quick Security Assessment...")
    start_time = time.time()
    try:
        response = requests.get(f"{BASE_URL}/analyze/quick-assessment", timeout=10)
        elapsed = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success in {elapsed:.1f}s")
            print(f"Assessment preview: {data['assessment'][:150]}...")
            print(f"Data sources: {data.get('data_sources', 0)}")
        else:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Fast Root Cause Analysis
    print("\n🔍 Testing Fast Root Cause Analysis...")
    start_time = time.time()
    try:
        response = requests.post(f"{BASE_URL}/analyze/fast/root-cause", json={
            "query": "Why is port 3000 open and what are the security implications?",
            "max_results": 3
        }, timeout=15)
        
        elapsed = time.time() - start_time
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success in {elapsed:.1f}s")
            print(f"Analysis preview: {data['analysis'][:150]}...")
            print(f"Context docs: {data.get('context_documents', 0)}")
        else:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Fast Recommendations
    print("\n💡 Testing Fast Recommendations...")
    start_time = time.time()
    try:
        response = requests.post(f"{BASE_URL}/analyze/fast/recommendations", json={
            "query": "How should I secure the open ports found in the scan?",
            "max_results": 3
        }, timeout=15)
        
        elapsed = time.time() - start_time
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success in {elapsed:.1f}s")
            print(f"Recommendations preview: {data['recommendations'][:150]}...")
            print(f"Context docs: {data.get('context_documents', 0)}")
        else:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 4: Fast Comprehensive Analysis
    print("\n🎯 Testing Fast Comprehensive Analysis...")
    start_time = time.time()
    try:
        response = requests.post(f"{BASE_URL}/analyze/fast", json={
            "query": "Analyze the overall security posture from scan results",
            "include_recommendations": True,
            "max_results": 3
        }, timeout=20)
        
        elapsed = time.time() - start_time
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success in {elapsed:.1f}s")
            print(f"Summary preview: {data['summary'][:150]}...")
            print(f"Has root cause: {'Yes' if data.get('root_cause_analysis') else 'No'}")
            print(f"Has recommendations: {'Yes' if data.get('recommendations') else 'No'}")
        else:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 5: Original endpoint with fallback
    print("\n🔄 Testing Original Analyze Endpoint (with fast fallback)...")
    start_time = time.time()
    try:
        response = requests.post(f"{BASE_URL}/analyze", json={
            "query": "What security risks were identified?",
            "max_results": 3
        }, timeout=25)
        
        elapsed = time.time() - start_time
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success in {elapsed:.1f}s")
            if data.get('summary'):
                print(f"Summary preview: {data['summary'][:150]}...")
            else:
                print("⚠️ No summary in response")
        else:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Fast Endpoint Testing Complete!")
    
    print("\n📍 New Fast Endpoints Available:")
    print("• GET  /analyze/quick-assessment - Quick overall assessment")
    print("• POST /analyze/fast/root-cause - Fast root cause analysis")  
    print("• POST /analyze/fast/recommendations - Fast recommendations")
    print("• POST /analyze/fast - Fast comprehensive analysis")
    print("\n🔗 Visit http://localhost:8000/docs to explore all endpoints")

def run_diagnostic_first():
    """Run the diagnostic script first"""
    print("🔧 Running Diagnostics First...")
    print("=" * 40)
    
    # Test basic connectivity
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Server is healthy")
        else:
            print("❌ Server health check failed")
            return False
    except:
        print("❌ Cannot connect to server")
        print("Please ensure server is running: python run_server.py")
        return False
    
    # Test search endpoint
    try:
        response = requests.get(f"{BASE_URL}/search", params={"query": "port", "k": 1}, timeout=5)
        if response.status_code == 200:
            print("✅ Vector search is working")
            return True
        else:
            print(f"⚠️ Search issues detected: {response.status_code}")
            return True  # Continue anyway
    except Exception as e:
        print(f"⚠️ Search warning: {e}")
        return True  # Continue anyway

if __name__ == "__main__":
    if run_diagnostic_first():
        test_fast_endpoints()
    else:
        print("\n❌ Diagnostics failed. Please check server status.")
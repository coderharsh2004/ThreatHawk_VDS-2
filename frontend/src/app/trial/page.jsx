"use client";
import React from "react";

export default function DeepNetworkScanSample() {
  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900">Deep Network Scan Sample</h1>
        <p className="mt-2 text-sm text-neutral-600">This is a sample rendering of a Deep Network Scan using hardcoded data.</p>
      </div>
      <div className="space-y-8">
        {/* Scan Metadata Table */}
        <div className="bg-white rounded-lg border border-neutral-200/30 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Scan Metadata</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-black color-white -50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Field</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Report ID</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">nmap_12345</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Scan Type</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">Deep Network Scan</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Report Path</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">/scans/nmap_12345.xml</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Deep Scan</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">Yes</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Scanner</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">Nmap 7.94</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Start Time</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">2025-05-01T10:00:00Z</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Arguments</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">-sV -sC --script=vulners</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-lg border border-neutral-200/30 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Summary</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 bg-black text-left text-xs font-medium text-white uppercase tracking-wider">Metric</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Count</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Hosts Up</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">1</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Open Ports</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">2</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Filtered Ports</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Hosts Table */}
        <div className="bg-white rounded-lg border border-neutral-200/30 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Hosts</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Hostnames</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">RTT (ms)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Reason</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">192.168.1.100</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">server.local</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">Active</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">5.12</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">syn-ack</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Open Ports Table */}
        <div className="bg-white rounded-lg border border-neutral-200/30 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Open Ports</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Host IP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Port/Protocol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Product</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">192.168.1.100</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">80/tcp</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">http</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">Apache 2.4.41</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">192.168.1.100</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">443/tcp</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">https</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">Apache 2.4.41</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Vulnerabilities Table */}
        <div className="bg-white rounded-lg border border-neutral-200/30 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Vulnerabilities</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Host IP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Port</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Vulners ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">CVSS Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Exploit URL</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">192.168.1.100</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">80/tcp</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">CVE-2024-6387</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">8.1</td>
                  <td className="px-6 py-4 text-sm text-neutral-900">
                    <a
                      href="https://vulners.com/cve/CVE-2024-6387"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      https://vulners.com/cve/CVE-2024-6387
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
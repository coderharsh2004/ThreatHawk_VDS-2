"use client";
import { useState } from "react";
import axios from "axios";

export default function VulnerabilityScanner() {
  const [target, setTarget] = useState("");
  const [type, setType] = useState("NETWORK");
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleScan = async () => {
    if (!target || !isValidUrl(target)) {
      setError("Please enter a valid URL (e.g., https://example.com).");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/scan-and-scrape", {
        target,
        type,
      });
      setScanResult(data?.scanResult || null);
    } catch (err) {
      console.error("Axios Error:", err.message, err.response?.data, err.response?.status);
      setError(
        err.response?.data?.error || "Error scanning. Check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  // Render OWASP ZAP results (for WEB scan)
  const renderZapResults = (result) => {
    const severityColors = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-blue-100 text-blue-800",
      Informational: "bg-gray-100 text-gray-800",
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {["High", "Medium", "Low", "Informational", "False Positives"].map((level, idx) => (
            <div key={level} className="bg-white p-4 rounded-lg border border-neutral-200/30 shadow-sm">
              <div className="flex items-center">
                <div
                  className={`rounded-full p-2 ${
                    ["bg-red-100", "bg-yellow-100", "bg-blue-100", "bg-gray-100", "bg-gray-100"][idx]
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-neutral-600">{level}</p>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {result.summary?.[level.toLowerCase().replace(" ", "_")] || 0}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200/30 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-900 mb-3">Scan Metadata</h3>
          <div className="text-sm text-neutral-600 space-y-1">
            <p><strong>Report ID:</strong> {result.report_id || "N/A"}</p>
            <p><strong>Scan Type:</strong> {result.scan_type_full || result.scan_type || "N/A"}</p>
            <p><strong>Report Path:</strong> {result.report_path || "N/A"}</p>
            <p><strong>Deep Scan:</strong> {result.is_deep ? "Yes" : "No"}</p>
          </div>
        </div>

        {result.vulnerabilities?.length ? (
          result.vulnerabilities.map((vuln, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-neutral-200/30 shadow-sm p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      severityColors[vuln.severity]
                    }`}
                  >
                    {vuln.severity}
                  </span>
                  <h3 className="ml-2 text-base font-medium text-neutral-900">{vuln.name || "Unknown"}</h3>
                </div>
                <span className="text-sm text-neutral-600">
                  Instances: {vuln.instance_count || 0}
                </span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">{vuln.description || "No description available."}</p>
              <div className="bg-neutral-50 p-3 rounded-md mb-3">
                <h4 className="text-sm font-medium text-neutral-900 mb-1">Solution:</h4>
                <p className="text-sm text-neutral-600">{vuln.solution || "No solution provided."}</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button className="text-sm text-neutral-600 hover:text-neutral-900">
                  Mark as Fixed
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-600">No vulnerabilities found.</p>
        )}
      </div>
    );
  };

  // Render Nmap results (for NETWORK and NETWORK_DEEP scans)
  const renderNmapResults = (result) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-neutral-200/30 shadow-sm">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-green-100">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-neutral-600">Hosts Up</p>
                <h3 className="text-lg font-semibold text-neutral-900">{result.summary?.hosts_up || 0}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200/30 shadow-sm">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-blue-100">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-neutral-600">Open Ports</p>
                <h3 className="text-lg font-semibold text-neutral-900">{result.summary?.open_ports || 0}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200/30 shadow-sm">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-neutral-600">Filtered Ports</p>
                <h3 className="text-lg font-semibold text-neutral-900">{result.summary?.filtered_ports || 0}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200/30 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-900 mb-3">Scan Metadata</h3>
          <div className="text-sm text-neutral-600 space-y-1">
            <p><strong>Report ID:</strong> {result.report_id || "N/A"}</p>
            <p><strong>Scan Type:</strong> {result.scan_type_full || result.scan_type || "N/A"}</p>
            <p><strong>Scanner:</strong> {result.metadata?.scanner || "N/A"} {result.metadata?.version || ""}</p>
            <p><strong>Start Time:</strong> {result.metadata?.start_time || "N/A"}</p>
            <p><strong>Arguments:</strong> {result.metadata?.args || "N/A"}</p>
            <p><strong>Report Path:</strong> {result.report_path || "N/A"}</p>
            <p><strong>Deep Scan:</strong> {result.is_deep ? "Yes" : "No"}</p>
          </div>
        </div>

        {result.hosts?.length ? (
          result.hosts.map((host, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-neutral-200/30 shadow-sm p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      host.status === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {host.status === "up" ? "Active" : "Inactive"}
                  </span>
                  <h3 className="ml-2 text-base font-medium text-neutral-900">IP: {host.ip_address || "N/A"}</h3>
                </div>
                <span className="text-sm text-neutral-600">
                  RTT: {host.round_trip_time ? `${host.round_trip_time}ms` : "N/A"}
                </span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">
                <strong>Hostnames:</strong>{" "}
                {host.hostnames?.length ? host.hostnames.map((h) => h.name).join(", ") : "None"}
              </p>
              <p className="text-sm text-neutral-600 mb-3">
                <strong>Reason:</strong> {host.reason || "N/A"}
              </p>
              <div className="bg-neutral-50 p-3 rounded-md">
                <h4 className="text-sm font-medium text-neutral-900 mb-2">Open Ports:</h4>
                {host.open_ports?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {host.open_ports.map((port) => (
                      <div key={port.portid} className="text-sm text-neutral-600">
                        <p><strong>Port:</strong> {port.portid}/{port.protocol}</p>
                        <p><strong>Service:</strong> {port.service?.name || "Unknown"}</p>
                        <p>
                          <strong>Product:</strong>{" "}
                          {port.service?.version || port.service?.product || "Unknown"}
                        </p>
                        {port.vulnerabilities?.length > 0 && (
                          <div className="mt-2">
                            <h5 className="text-sm font-medium text-neutral-900 mb-1">Vulnerabilities:</h5>
                            {port.vulnerabilities.map((vuln, vIdx) => (
                              <div
                                key={vIdx}
                                className="bg-red-50 p-2 rounded-md mb-2 text-sm"
                              >
                                <p><strong>Vulners ID:</strong> {vuln.vulners_id}</p>
                                <p><strong>CVSS Score:</strong> {vuln.cvss_score}</p>
                                <p>
                                  <strong>Exploit URL:</strong>{" "}
                                  <a
                                    href={vuln.exploit_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:underline"
                                  >
                                    {vuln.exploit_url}
                                  </a>
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-600">No open ports detected.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-600">No hosts found.</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Vulnerability Scanner</h1>
        <button
          onClick={handleScan}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          } transition-colors duration-200`}
        >
          {loading ? "Scanning..." : "Start Scan"}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200/30 p-6 mb-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Scan Options</h2>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleScan(); }}>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-neutral-700">
              Website URL
            </label>
            <div className="mt-1 flex rounded-md shadow-lg">
              <input
                type="url"
                id="url"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 block w-full text-lg px-3 py-6 rounded-md border border-neutral-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-full">
              <label htmlFor="scan-type" className="block text-sm font-medium text-neutral-700">
                Scan Type
              </label>
              <select
                id="scan-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="block w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="NETWORK">Network Scan</option>
                <option value="NETWORK_DEEP">Deep Network Scan </option>
                <option value="WEB">Web Scan </option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white ${
                loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              } focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
            >
              {loading ? "Scanning..." : "Start Scan"}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-100 text-red-800 rounded-lg border border-red-200/30">
          {error}
        </div>
      )}

      {scanResult ? (
        <div className="mt-8">
          {scanResult.scan_type?.includes("zap") || type === "WEB"
            ? renderZapResults(scanResult)
            : renderNmapResults(scanResult)}
        </div>
      ) : (
        <p className="text-neutral-600 text-center mt-8">No scan results available. Run a scan to see results.</p>
      )}
    </div>
  );
}
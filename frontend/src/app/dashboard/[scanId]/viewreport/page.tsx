"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Report {
  report_id: string;
  scan_type: string;
  scan_type_full: string;
  is_deep: boolean;
  summary: {
    high?: number;
    medium?: number;
    low?: number;
    informational?: number;
    false_positives?: number;
    hosts_up?: number;
    open_ports?: number;
    filtered_ports?: number;
  };
  vulnerabilities?: Array<{
    name: string;
    severity: string;
    description: string;
    solution: string;
    instance_count: number;
  }>;
  hosts?: Array<{
    status: string;
    ip_address: string;
    hostnames: Array<{ name: string; type: string }>;
    round_trip_time: number;
    open_ports: Array<{
      portid: string;
      protocol: string;
      service: {
        name: string;
        product: string;
        version: string;
        extrainfo: string;
      };
    }>;
  }>;
  metadata?: {
    scanner: string;
    version: string;
    args: string;
    start_time: string;
  };
  report_path: string;
}

export default function ViewReport() {
  const { scanId } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch report data
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/user-history/17"
        );
        const data = await response.json();
        if (data.success) {
          const scan = data.data.find(
            (item: any) => item.actions.viewReport.report_id === scanId
          );
          if (scan) {
            setReport(scan.actions.viewReport);
          } else {
            setError("Report not found");
          }
        } else {
          setError("Failed to fetch report");
        }
      } catch (err) {
        setError("Error fetching report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [scanId]);

  // Render OWASP ZAP results (for WEB scan)
  const renderZapResults = (result: Report) => {
    const severityColors = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-blue-100 text-blue-800",
      Informational: "bg-gray-100 text-gray-800",
    };

    return (
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {["High", "Medium", "Low", "Informational", "False Positives"].map(
            (level, idx) => (
              <div
                key={level}
                className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200"
              >
                <div className="flex items-center">
                  <div
                    className={`rounded-full p-3 ${
                      [
                        "bg-red-100",
                        "bg-yellow-100",
                        "bg-blue-100",
                        "bg-gray-100",
                        "bg-gray-100",
                      ][idx]
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-neutral-600">{level}</p>
                    <h3 className="text-xl font-bold text-neutral-900">
                      {/* {result.summary?.[level.toLowerCase().replace(" ", "_")] || 0} */}
                    </h3>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Scan Metadata */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Scan Metadata
          </h3>
          <p className="text-sm text-neutral-600">
            <strong>Report ID:</strong> {result.report_id || "N/A"}
          </p>
          <p className="text-sm text-neutral-600">
            <strong>Scan Type:</strong>{" "}
            {result.scan_type_full || result.scan_type || "N/A"}
          </p>
          <p className="text-sm text-neutral-600">
            <strong>Report Path:</strong> {result.report_path || "N/A"}
          </p>
          <p className="text-sm text-neutral-600">
            <strong>Deep Scan:</strong> {result.is_deep ? "Yes" : "No"}
          </p>
        </div>

        {/* Vulnerabilities List */}
        {result.vulnerabilities?.length ? (
          result.vulnerabilities.map((vuln, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full `}
                    >
                      {vuln.severity}
                    </span>
                    <h3 className="ml-3 text-lg font-medium">
                      {vuln.name || "Unknown"}
                    </h3>
                  </div>
                  <span className="text-sm text-neutral-500">
                    Instances: {vuln.instance_count || 0}
                  </span>
                </div>
                <p className="text-neutral-600 mb-4">
                  {vuln.description || "No description available."}
                </p>
                <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">
                    Solution:
                  </h4>
                  <p className="text-sm text-neutral-600">
                    {vuln.solution || "No solution provided."}
                  </p>
                </div>
                <div className="flex justify-end space-x-4">
                  <button className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900">
                    Mark as Fixed
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-neutral-600">No vulnerabilities found.</p>
        )}
      </div>
    );
  };

  // Render Nmap results (for NETWORK scan)
  const renderNmapResults = (result: Report) => {
    return (
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-green-100">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-neutral-600">Hosts Up</p>
                <h3 className="text-xl font-bold text-neutral-900">
                  {result.summary?.hosts_up || 0}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-blue-100">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-neutral-600">Open Ports</p>
                <h3 className="text-xl font-bold text-neutral-900">
                  {result.summary?.open_ports || 0}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-gray-100">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 17V7m0 10h6m-6 0H3m12 0h6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-neutral-600">Filtered Ports</p>
                <h3 className="text-xl font-bold text-neutral-900">
                  {result.summary?.filtered_ports || 0}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Scan Metadata */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Scan Metadata
          </h3>
          <p className="text-sm text-neutral-600">
            <strong>Report ID:</strong> {result.report_id || "N/A"}
          </p>
          <p className="text-sm text-neutral-600">
            <strong>Scan Type:</strong>{" "}
            {result.scan_type_full || result.scan_type || "N/A"}
          </p>
          <p className="text-sm text-neutral-600">
            <strong>Scanner:</strong> {result.metadata?.scanner || "N/A"}{" "}
            {result.metadata?.version || ""}
          </p>
          <p className="text-sm text-neutral-600">
            <strong>Start Time:</strong> {result.metadata?.start_time || "N/A"}
          </p>
          <p className="text-sm text-neutral-600">
            <strong>Arguments:</strong> {result.metadata?.args || "N/A"}
          </p>
          <p className="text-sm text-neutral-600">
            <strong>Report Path:</strong> {result.report_path || "N/A"}
          </p>
          <p className="text-sm text-neutral-600">
            <strong>Deep Scan:</strong> {result.is_deep ? "Yes" : "No"}
          </p>
        </div>

        {/* Hosts List */}
        {result.hosts?.length ? (
          result.hosts.map((host, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        host.status === "up"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {host.status === "up" ? "Active" : "Inactive"}
                    </span>
                    <h3 className="ml-3 text-lg font-medium">
                      IP: {host.ip_address || "N/A"}
                    </h3>
                  </div>
                  <span className="text-sm text-neutral-500">
                    RTT:{" "}
                    {host.round_trip_time ? `${host.round_trip_time}ms` : "N/A"}
                  </span>
                </div>
                <p className="text-neutral-600 mb-4">
                  <strong>Hostnames:</strong>{" "}
                  {host.hostnames?.length
                    ? host.hostnames.map((h) => h.name).join(", ")
                    : "None"}
                </p>
                <p className="text-neutral-600 mb-4">
                  <strong>Reason:</strong>
                </p>
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">
                    Open Ports:
                  </h4>
                  {host.open_ports?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {host.open_ports.map((port) => (
                        <div
                          key={port.portid}
                          className="text-sm text-neutral-600"
                        >
                          <p>
                            <strong>Port:</strong> {port.portid}/{port.protocol}
                          </p>
                          <p>
                            <strong>Service:</strong>{" "}
                            {port.service?.name || "Unknown"}
                          </p>
                          <p>
                            <strong>Product:</strong>{" "}
                            {port.service?.product || "Unknown"}
                            {port.service?.version
                              ? ` ${port.service.version}`
                              : ""}
                          </p>
                          <p>
                            <strong>Extra Info:</strong>{" "}
                            {port.service?.extrainfo || "None"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-600">
                      No open ports detected.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-neutral-600">No hosts found.</p>
        )}
      </div>
    );
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => router.push("/scan-history")}
          className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-900"
        >
          Back to Scan History
        </button>
      </div>
    );
  if (!report)
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600 mb-4">Report not found</p>
        <button
          onClick={() => router.push("/scan-history")}
          className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-900"
        >
          Back to Scan History
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Scan Report: {scanId}
        </h1>
        <button
          onClick={() => router.push("/scan-history")}
          className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-900"
        >
          Back to Scan History
        </button>
      </div>
      {report.scan_type?.includes("zap") || report.scan_type === "zap_regular"
        ? renderZapResults(report)
        : renderNmapResults(report)}
    </div>
  );
}

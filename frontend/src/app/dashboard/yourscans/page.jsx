// // // "use client"
// // // import React, { useState, useEffect } from "react";

// // // const ScanHistory: React.FC = () => {
// // //   const [scanHistory, setScanHistory] = useState<any[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const itemsPerPage = 10;

// // //   // Fetch scan history data
// // //   useEffect(() => {
// // //     const fetchScanHistory = async () => {
// // //       try {
// // //         const response = await fetch("http://localhost:5000/api/user-history/17");
// // //         const data = await response.json();
// // //         if (data.success) {
// // //           setScanHistory(data.data);
// // //         } else {
// // //           setError("Failed to fetch scan history");
// // //         }
// // //       } catch (err) {
// // //         setError("Error fetching scan history");
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };
// // //     fetchScanHistory();
// // //   }, []);

// // //   // Pagination logic
// // //   const totalPages = Math.ceil(scanHistory.length / itemsPerPage);
// // //   const paginatedScans = scanHistory.slice(
// // //     (currentPage - 1) * itemsPerPage,
// // //     currentPage * itemsPerPage
// // //   );

// // //   const handlePageChange = (page: number) => {
// // //     if (page >= 1 && page <= totalPages) {
// // //       setCurrentPage(page);
// // //     }
// // //   };

// // //   if (loading) return <div className="text-center py-8">Loading...</div>;
// // //   if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

// // //   return (
// // //     <div id="scanhistory" className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
// // //       {/* Header */}
// // //       <div className="mb-8">
// // //         <div className="flex items-center justify-between">
// // //           <h1 className="text-2xl font-semibold text-neutral-900">Scan History</h1>
// // //           <div className="flex space-x-4">
// // //             {/* Search Input */}
// // //             <div className="relative">
// // //               <input
// // //                 type="text"
// // //                 placeholder="Search scans..."
// // //                 className="w-64 px-4 py-2 rounded-lg border border-neutral-200/30 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
// // //               />
// // //               <svg
// // //                 className="absolute right-3 top-2.5 w-5 h-5 text-neutral-400"
// // //                 fill="none"
// // //                 stroke="currentColor"
// // //                 viewBox="0 0 24 24"
// // //               >
// // //                 <path
// // //                   strokeLinecap="round"
// // //                   strokeLinejoin="round"
// // //                   strokeWidth="2"
// // //                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
// // //                 />
// // //               </svg>
// // //             </div>

// // //             {/* Filter Select */}
// // //             <div className="relative">
// // //               <select
// // //                 className="appearance-none w-48 px-4 py-2 rounded-lg border border-neutral-200/30 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
// // //               >
// // //                 <option>All Time</option>
// // //                 <option>Last 7 days</option>
// // //                 <option>Last 30 days</option>
// // //                 <option>Last 3 months</option>
// // //               </select>
// // //               <svg
// // //                 className="absolute right-3 top-2.5 w-5 h-5 text-neutral-400"
// // //                 fill="none"
// // //                 stroke="currentColor"
// // //                 viewBox="0 0 24 24"
// // //               >
// // //                 <path
// // //                   strokeLinecap="round"
// // //                   strokeLinejoin="round"
// // //                   strokeWidth="2"
// // //                   d="M19 9l-7 7-7-7"
// // //                 />
// // //               </svg>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Scan History Table */}
// // //       <div className="bg-white rounded-lg border border-neutral-200/30">
// // //         <div className="overflow-x-auto">
// // //           <table className="w-full">
// // //             <thead>
// // //               <tr className="bg-neutral-50">
// // //                 {["Website", "Scan Date", "Scan Type", "Status", "Findings", "Actions"].map(
// // //                   (heading) => (
// // //                     <th
// // //                       key={heading}
// // //                       className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
// // //                     >
// // //                       {heading}
// // //                     </th>
// // //                   )
// // //                 )}
// // //               </tr>
// // //             </thead>
// // //             <tbody className="divide-y divide-neutral-200/30">
// // //               {paginatedScans.map((scan, index) => (
// // //                 <ScanHistoryRow
// // //                   key={scan.actions.viewReport.report_id}
// // //                   target={scan.target}
// // //                   scanDate={new Date(scan.scanDate).toLocaleString()}
// // //                   scanType={scan.scanType}
// // //                   status={scan.status}
// // //                   findings={
// // //                     scan.scanType === "WEB"
// // //                       ? scan.actions.viewReport.summary
// // //                       : { open_ports: scan.actions.viewReport.summary.open_ports }
// // //                   }
// // //                   reportId={scan.actions.viewReport.report_id}
// // //                   downloadPdf={scan.actions.downloadPdf}
// // //                   avatarBg={`bg-${["indigo", "green", "blue", "purple", "red"][index % 5]}-100`}
// // //                   avatarTextColor={`text-${["indigo", "green", "blue", "purple", "red"][index % 5]}-600`}
// // //                   avatarLetter={scan.target.charAt(8).toUpperCase()} // First letter of domain
// // //                 />
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         </div>

// // //         {/* Pagination */}
// // //         <div className="px-6 py-4 border-t border-neutral-200/30">
// // //           <div className="flex items-center justify-between">
// // //             <div className="text-sm text-neutral-700">
// // //               Showing{" "}
// // //               <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
// // //               <span className="font-medium">
// // //                 {Math.min(currentPage * itemsPerPage, scanHistory.length)}
// // //               </span>{" "}
// // //               of <span className="font-medium">{scanHistory.length}</span> results
// // //             </div>
// // //             <div className="flex space-x-2">
// // //               <PaginationButton
// // //                 label="Previous"
// // //                 onClick={() => handlePageChange(currentPage - 1)}
// // //                 disabled={currentPage === 1}
// // //               />
// // //               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// // //                 <PaginationButton
// // //                   key={page}
// // //                   label={page.toString()}
// // //                   active={page === currentPage}
// // //                   onClick={() => handlePageChange(page)}
// // //                 />
// // //               ))}
// // //               <PaginationButton
// // //                 label="Next"
// // //                 onClick={() => handlePageChange(currentPage + 1)}
// // //                 disabled={currentPage === totalPages}
// // //               />
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Subcomponents
// // // interface ScanHistoryRowProps {
// // //   target: string;
// // //   scanDate: string;
// // //   scanType: string;
// // //   status: string;
// // //   findings: {
// // //     high?: number;
// // //     medium?: number;
// // //     low?: number;
// // //     informational?: number;
// // //     open_ports?: number;
// // //   };
// // //   reportId: string;
// // //   downloadPdf: string;
// // //   avatarBg: string;
// // //   avatarTextColor: string;
// // //   avatarLetter: string;
// // // }

// // // const ScanHistoryRow: React.FC<ScanHistoryRowProps> = ({
// // //   target,
// // //   scanDate,
// // //   scanType,
// // //   status,
// // //   findings,
// // //   reportId,
// // //   downloadPdf,
// // //   avatarBg,
// // //   avatarTextColor,
// // //   avatarLetter,
// // // }) => {
// // //   return (
// // //     <tr className="hover:bg-neutral-50">
// // //       <td className="px-6 py-4">
// // //         <div className="flex items-center">
// // //           <div className={`w-8 h-8 ${avatarBg} rounded-full flex items-center justify-center`}>
// // //             <span className={`${avatarTextColor} font-medium`}>{avatarLetter}</span>
// // //           </div>
// // //           <span className="ml-3">{target}</span>
// // //         </div>
// // //       </td>
// // //       <td className="px-6 py-4">{scanDate}</td>
// // //       <td className="px-6 py-4">{scanType}</td>
// // //       <td className="px-6 py-4">
// // //         <span
// // //           className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
// // //             status === "SUCCESS"
// // //               ? "bg-green-100 text-green-800"
// // //               : "bg-red-100 text-red-800"
// // //           }`}
// // //         >
// // //           {status}
// // //         </span>
// // //       </td>
// // //       <td className="px-6 py-4">
// // //         <div className="flex space-x-2">
// // //           {scanType === "WEB" ? (
// // //             <>
// // //               {findings.high && findings.high > 0 && (
// // //                 <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
// // //                   {findings.high} High
// // //                 </span>
// // //               )}
// // //               {findings.medium && findings.medium > 0 && (
// // //                 <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
// // //                   {findings.medium} Medium
// // //                 </span>
// // //               )}
// // //               {findings.low && findings.low > 0 && (
// // //                 <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
// // //                   {findings.low} Low
// // //                 </span>
// // //               )}
// // //               {findings.informational && findings.informational > 0 && (
// // //                 <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
// // //                   {findings.informational} Info
// // //                 </span>
// // //               )}
// // //             </>
// // //           ) : (
// // //             <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
// // //               {findings.open_ports} Open Ports
// // //             </span>
// // //           )}
// // //         </div>
// // //       </td>
// // //       <td className="px-6 py-4">
// // //         <div className="flex space-x-3">
// // //           <button
// // //             className="text-indigo-600 hover:text-indigo-900"
// // //             onClick={() => alert(`View report: ${reportId}`)} // Replace with actual report view logic
// // //           >
// // //             View Report
// // //           </button>
// // //           <a
// // //             href={downloadPdf}
// // //             download
// // //             className="text-neutral-600 hover:text-neutral-900"
// // //           >
// // //             Download PDF
// // //           </a>
// // //         </div>
// // //       </td>
// // //     </tr>
// // //   );
// // // };

// // // interface PaginationButtonProps {
// // //   label: string;
// // //   active?: boolean;
// // //   disabled?: boolean;
// // //   onClick?: () => void;
// // // }

// // // const PaginationButton: React.FC<PaginationButtonProps> = ({
// // //   label,
// // //   active = false,
// // //   disabled = false,
// // //   onClick,
// // // }) => {
// // //   return (
// // //     <button
// // //       className={`px-3 py-1 border border-neutral-200/30 rounded-md text-sm text-neutral-700 ${
// // //         active ? "bg-neutral-50" : disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-50"
// // //       }`}
// // //       onClick={onClick}
// // //       disabled={disabled}
// // //     >
// // //       {label}
// // //     </button>
// // //   );
// // // };

// // // export default ScanHistory;





// // "use client";
// // import React, { useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";

// // interface Scan {
// //   target: string;
// //   scanDate: string;
// //   scanType: "NETWORK" | "WEB";
// //   status: string;
// //   actions: {
// //     viewReport: {
// //       report_id: string;
// //       scan_type: string;
// //       scan_type_full: string;
// //       is_deep: boolean;
// //       summary: {
// //         high?: number;
// //         medium?: number;
// //         low?: number;
// //         informational?: number;
// //         false_positives?: number;
// //         hosts_up?: number;
// //         open_ports?: number;
// //         filtered_ports?: number;
// //       };
// //       vulnerabilities?: Array<{
// //         name: string;
// //         severity: string;
// //         description: string;
// //         solution: string;
// //         instance_count: number;
// //       }>;
// //       hosts?: Array<{
// //         status: string;
// //         ip_address: string;
// //         hostnames: Array<{ name: string; type: string }>;
// //         round_trip_time: number;
// //         open_ports: Array<{
// //           portid: string;
// //           protocol: string;
// //           service: { name: string; product: string; version: string; extrainfo: string };
// //         }>;
// //       }>;
// //       metadata?: {
// //         scanner: string;
// //         version: string;
// //         args: string;
// //         start_time: string;
// //       };
// //       report_path: string;
// //     };
// //     downloadPdf: string;
// //   };
// // }

// // const ScanHistory = () => {
// //   const [scanHistory, setScanHistory] = useState<Scan[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 10;
// //   const router = useRouter();

// //   // Fetch scan history data
// //   useEffect(() => {
// //     const fetchScanHistory = async () => {
// //       try {
// //         const response = await fetch("http://localhost:5000/api/user-history/17");
// //         const data = await response.json();
// //         if (data.success) {
// //           setScanHistory(data.data);
// //         } else {
// //           setError("Failed to fetch scan history");
// //         }
// //       } catch (err) {
// //         setError("Error fetching scan history");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchScanHistory();
// //   }, []);

// //   // Pagination logic
// //   const totalPages = Math.ceil(scanHistory.length / itemsPerPage);
// //   const paginatedScans = scanHistory.slice(
// //     (currentPage - 1) * itemsPerPage,
// //     currentPage * itemsPerPage
// //   );

// //   const handlePageChange = (page: number) => {
// //     if (page >= 1 && page <= totalPages) {
// //       setCurrentPage(page);
// //     }
// //   };

// //   if (loading) return <div className="text-center py-8">Loading...</div>;
// //   if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

// //   return (
// //     <div id="scanhistory" className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
// //       {/* Header */}
// //       <div className="mb-8">
// //         <div className="flex items-center justify-between">
// //           <h1 className="text-2xl font-semibold text-neutral-900">Scan History</h1>
// //           <div className="flex space-x-4">
// //             <div className="relative">
// //               <input
// //                 type="text"
// //                 placeholder="Search scans..."
// //                 className="w-64 px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
// //               />
// //               <svg
// //                 className="absolute right-3 top-2.5 w-5 h-5 text-neutral-400"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth="2"
// //                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
// //                 />
// //               </svg>
// //             </div>
// //             <div className="relative">
// //               <select
// //                 className="appearance-none w-48 px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
// //               >
// //                 <option>All Time</option>
// //                 <option>Last 7 days</option>
// //                 <option>Last 30 days</option>
// //                 <option>Last 3 months</option>
// //               </select>
// //               <svg
// //                 className="absolute right-3 top-2.5 w-5 h-5 text-neutral-400"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth="2"
// //                   d="M19 9l-7 7-7-7"
// //                 />
// //               </svg>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Scan History Table */}
// //       <div className="bg-white rounded-lg border border-neutral-300">
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead>
// //               <tr className="bg-neutral-50">
// //                 {["Website", "Scan Date", "Scan Type", "Status", "Findings", "Actions"].map(
// //                   (heading) => (
// //                     <th
// //                       key={heading}
// //                       className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
// //                     >
// //                       {heading}
// //                     </th>
// //                   )
// //                 )}
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-neutral-200">
// //               {paginatedScans.map((scan, index) => (
// //                 <ScanHistoryRow
// //                   key={scan.actions.viewReport.report_id}
// //                   target={scan.target}
// //                   scanDate={new Date(scan.scanDate).toLocaleString()}
// //                   scanType={scan.scanType}
// //                   status={scan.status}
     
// //                   findings={
// //                     scan.scanType === "WEB"
// //                       ? scan.actions.viewReport.summary
// //                       : { open_ports: scan.actions.viewReport.summary.open_ports }
// //                   }
// //                   reportId={scan.actions.viewReport.report_id}
// //                   downloadPdf={`http://localhost:5000/reports/${scan.actions.viewReport.report_id}.${
// //                     scan.scanType === "WEB" ? "html" : "xml"
// //                   }`} // Adjusted for .xml/.html
// //                   avatarBg={`bg-${["indigo", "green", "blue", "purple", "red"][index % 5]}-100`}
// //                   avatarTextColor={`text-${["indigo", "green", "blue", "purple", "red"][index % 5]}-600`}
// //                   avatarLetter={scan.target.charAt(8).toUpperCase()}
// //                 />
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Pagination */}
// //         <div className="px-6 py-4 border-t border-neutral-200">
// //           <div className="flex items-center justify-between">
// //             <div className="text-sm text-neutral-700">
// //               Showing{" "}
// //               <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
// //               <span className="font-medium">
// //                 {Math.min(currentPage * itemsPerPage, scanHistory.length)}
// //               </span>{" "}
// //               of <span className="font-medium">{scanHistory.length}</span> results
// //             </div>
// //             <div className="flex space-x-2">
// //               <PaginationButton
// //                 label="Previous"
// //                 onClick={() => handlePageChange(currentPage - 1)}
// //                 disabled={currentPage === 1}
// //               />
// //               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// //                 <PaginationButton
// //                   key={page}
// //                   label={page.toString()}
// //                   active={page === currentPage}
// //                   onClick={() => handlePageChange(page)}
// //                 />
// //               ))}
// //               <PaginationButton
// //                 label="Next"
// //                 onClick={() => handlePageChange(currentPage + 1)}
// //                 disabled={currentPage === totalPages}
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // interface ScanHistoryRowProps {
// //   target: string;
// //   scanDate: string;
// //   scanType: string;
// //   status: string;
// //   findings: {
// //     high?: number;
// //     medium?: number;
// //     low?: number;
// //     informational?: number;
// //     open_ports?: number;
// //   };
// //   reportId: string;
// //   downloadPdf: string;
// //   avatarBg: string;
// //   avatarTextColor: string;
// //   avatarLetter: string;
// // }

// // const ScanHistoryRow = ({
// //   target,
// //   scanDate,
// //   scanType,
// //   status,
// //   findings,
// //   reportId,
// //   downloadPdf,
// //   avatarBg,
// //   avatarTextColor,
// //   avatarLetter,
// // }: ScanHistoryRowProps) => {
// //   const router = useRouter();

// //   return (
// //     <tr className="hover:bg-neutral-50">
// //       <td className="px-6 py-4">
// //         <div className="flex items-center">
// //           <div className={`w-8 h-8 ${avatarBg} rounded-full flex items-center justify-center`}>
// //             <span className={`${avatarTextColor} font-medium`}>{avatarLetter}</span>
// //           </div>
// //           <span className="ml-3">{target}</span>
// //         </div>
// //       </td>
// //       <td className="px-6 py-4">{scanDate}</td>
// //       <td className="px-6 py-4">{scanType}</td>
// //       <td className="px-6 py-4">
// //         <span
// //           className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
// //             status === "SUCCESS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
// //           }`}
// //         >
// //           {status}
// //         </span>
// //       </td>
// //       <td className="px-6 py-4">
// //         <div className="flex space-x-2">
// //           {scanType === "WEB" ? (
// //             <>
// //               {findings.high && findings.high > 0 && (
// //                 <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
// //                   {findings.high} High
// //                 </span>
// //               )}
// //               {findings.medium && findings.medium > 0 && (
// //                 <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
// //                   {findings.medium} Medium
// //                 </span>
// //               )}
// //               {findings.low && findings.low > 0 && (
// //                 <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
// //                   {findings.low} Low
// //                 </span>
// //               )}
// //               {findings.informational && findings.informational > 0 && (
// //                 <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
// //                   {findings.informational} Info
// //                 </span>
// //               )}
// //             </>
// //           ) : (
// //             <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
// //               {findings.open_ports} Open Ports
// //             </span>
// //           )}
// //         </div>
// //       </td>
// //       <td className="px-6 py-4">
// //         <div className="flex space-x-3">
// //           <button
// //             className="text-indigo-600 hover:text-indigo-900"
// //             onClick={() => router.push(`/dashboard/${reportId}/viewreport`)}
// //           >
// //             View Report
// //           </button>
// //           <a
// //             href={downloadPdf}
// //             download
// //             className="text-neutral-600 hover:text-neutral-900"
// //           >
// //             Download Report
// //           </a>
// //         </div>
// //       </td>
// //     </tr>
// //   );
// // };

// // interface PaginationButtonProps {
// //   label: string;
// //   active?: boolean;
// //   disabled?: boolean;
// //   onClick?: () => void;
// // }

// // const PaginationButton = ({ label, active = false, disabled = false, onClick }: PaginationButtonProps) => {
// //   return (
// //     <button
// //       className={`px-3 py-1 border border-neutral-200 rounded-md text-sm text-neutral-700 ${
// //         active ? "bg-neutral-50" : disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-50"
// //       }`}
// //       onClick={onClick}
// //       disabled={disabled}
// //     >
// //       {label}
// //     </button>
// //   );
// // };

// // export default ScanHistory;



















// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// interface Scan {
//   target: string;
//   scanDate: string;
//   scanType: "NETWORK" | "WEB";
//   status: string;
//   actions: {
//     viewReport: {
//       report_id: string;
//       scan_type: string;
//       scan_type_full: string;
//       is_deep: boolean;
//       summary?: {
//         high?: number;
//         medium?: number;
//         low?: number;
//         informational?: number;
//         false_positives?: number;
//         hosts_up?: number;
//         open_ports?: number;
//         filtered_ports?: number;
//       };
//       vulnerabilities?: Array<{
//         name: string;
//         severity: string;
//         description: string;
//         solution: string;
//         instance_count: number;
//       }>;
//       hosts?: Array<{
//         status: string;
//         ip_address: string;
//         hostnames: Array<{ name: string; type: string }>;
//         round_trip_time: number;
//         open_ports: Array<{
//           portid: string;
//           protocol: string;
//           service: { name: string; product: string; version: string; extrainfo: string };
//         }>;
//       }>;
//       metadata?: {
//         scanner: string;
//         version: string;
//         args: string;
//         start_time: string;
//       };
//       report_path: string;
//     };
//     downloadPdf: string;
//   };
// }

// const ScanHistory = () => {
//   const [scanHistory, setScanHistory] = useState<Scan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const router = useRouter();

//   // Fetch scan history data
//   useEffect(() => {
//     const fetchScanHistory = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/user-history/17");
//         const data = await response.json();
//         if (data.success) {
//           setScanHistory(data.data);
//         } else {
//           setError("Failed to fetch scan history");
//         }
//       } catch (err) {
//         setError("Error fetching scan history");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchScanHistory();
//   }, []);

//   // Pagination logic
//   const totalPages = Math.ceil(scanHistory.length / itemsPerPage);
//   const paginatedScans = scanHistory.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   if (loading) return <div className="text-center py-8">Loading...</div>;
//   if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

//   return (
//     <div id="scanhistory" className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-semibold text-neutral-900">Scan History</h1>
//           <div className="flex space-x-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search scans..."
//                 className="w-64 px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//               <svg
//                 className="absolute right-3 top-2.5 w-5 h-5 text-neutral-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </div>
//             <div className="relative">
//               <select
//                 className="appearance-none w-48 px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option>All Time</option>
//                 <option>Last 7 days</option>
//                 <option>Last 30 days</option>
//                 <option>Last 3 months</option>
//               </select>
//               <svg
//                 className="absolute right-3 top-2.5 w-5 h-5 text-neutral-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Scan History Table */}
//       <div className="bg-white rounded-lg border border-neutral-300">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-neutral-50">
//                 {["Website", "Scan Date", "Scan Type", "Status", "Findings", "Actions"].map(
//                   (heading) => (
//                     <th
//                       key={heading}
//                       className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
//                     >
//                       {heading}
//                     </th>
//                   )
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-neutral-200">
//               {paginatedScans.map((scan, index) => (
//                 <ScanHistoryRow
//                   key={scan.actions.viewReport.report_id}
//                   target={scan.target}
//                   scanDate={new Date(scan.scanDate).toLocaleString()}
//                   scanType={scan.scanType}
//                   status={scan.status}
//                   findings={
//                     scan.actions.viewReport.summary
//                       ? scan.scanType === "WEB"
//                         ? scan.actions.viewReport.summary
//                         : { open_ports: scan.actions.viewReport.summary.open_ports ?? 0 }
//                       : { high: 0, medium: 0, low: 0, informational: 0, open_ports: 0 }
//                   }
//                   reportId={scan.actions.viewReport.report_id}
//                   downloadPdf={`http://localhost:5000/reports/${scan.actions.viewReport.report_id}.${
//                     scan.scanType === "WEB" ? "html" : "xml"
//                   }`}
//                   avatarBg={`bg-${["indigo", "green", "blue", "purple", "red"][index % 5]}-100`}
//                   avatarTextColor={`text-${["indigo", "green", "blue", "purple", "red"][index % 5]}-600`}
//                   avatarLetter={scan.target.charAt(8).toUpperCase()}
//                 />
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="px-6 py-4 border-t border-neutral-200">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-neutral-700">
//               Showing{" "}
//               <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
//               <span className="font-medium">
//                 {Math.min(currentPage * itemsPerPage, scanHistory.length)}
//               </span>{" "}
//               of <span className="font-medium">{scanHistory.length}</span> results
//             </div>
//             <div className="flex space-x-2">
//               <PaginationButton
//                 label="Previous"
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//               />
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <PaginationButton
//                   key={page}
//                   label={page.toString()}
//                   active={page === currentPage}
//                   onClick={() => handlePageChange(page)}
//                 />
//               ))}
//               <PaginationButton
//                 label="Next"
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// interface ScanHistoryRowProps {
//   target: string;
//   scanDate: string;
//   scanType: string;
//   status: string;
//   findings: {
//     high?: number;
//     medium?: number;
//     low?: number;
//     informational?: number;
//     open_ports?: number;
//   };
//   reportId: string;
//   downloadPdf: string;
//   avatarBg: string;
//   avatarTextColor: string;
//   avatarLetter: string;
// }

// const ScanHistoryRow = ({
//   target,
//   scanDate,
//   scanType,
//   status,
//   findings,
//   reportId,
//   downloadPdf,
//   avatarBg,
//   avatarTextColor,
//   avatarLetter,
// }: ScanHistoryRowProps) => {
//   const router = useRouter();

//   return (
//     <tr className="hover:bg-neutral-50">
//       <td className="px-6 py-4">
//         <div className="flex items-center">
//           <div className={`w-8 h-8 ${avatarBg} rounded-full flex items-center justify-center`}>
//             <span className={`${avatarTextColor} font-medium`}>{avatarLetter}</span>
//           </div>
//           <span className="ml-3">{target}</span>
//         </div>
//       </td>
//       <td className="px-6 py-4">{scanDate}</td>
//       <td className="px-6 py-4">{scanType}</td>
//       <td className="px-6 py-4">
//         <span
//           className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//             status === "SUCCESS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//           }`}
//         >
//           {status}
//         </span>
//       </td>
//       <td className="px-6 py-4">
//         <div className="flex space-x-2">
//           {scanType === "WEB" ? (
//             <>
//               {findings.high && findings.high > 0 && (
//                 <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
//                   {findings.high} High
//                 </span>
//               )}
//               {findings.medium && findings.medium > 0 && (
//                 <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
//                   {findings.medium} Medium
//                 </span>
//               )}
//               {findings.low && findings.low > 0 && (
//                 <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
//                   {findings.low} Low
//                 </span>
//               )}
//               {findings.informational && findings.informational > 0 && (
//                 <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
//                   {findings.informational} Info
//                 </span>
//               )}
//             </>
//           ) : (
//             <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
//               {findings.open_ports ?? 0} Open Ports
//             </span>
//           )}
//         </div>
//       </td>
//       <td className="px-6 py-4">
//         <div className="flex space-x-3">
//           <button
//             className="text-indigo-600 hover:text-indigo-900"
//             onClick={() => router.push(`/dashboard/${reportId}/viewreport`)}
//           >
//             View Report
//           </button>
//           <a
//             href={downloadPdf}
//             download
//             className="text-neutral-600 hover:text-neutral-900"
//           >
//             Download Report
//           </a>
//         </div>
//       </td>
//     </tr>
//   );
// };

// interface PaginationButtonProps {
//   label: string;
//   active?: boolean;
//   disabled?: boolean;
//   onClick?: () => void;
// }

// const PaginationButton = ({ label, active = false, disabled = false, onClick }: PaginationButtonProps) => {
//   return (
//     <button
//       className={`px-3 py-1 border border-neutral-200 rounded-md text-sm text-neutral-700 ${
//         active ? "bg-neutral-50" : disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-50"
//       }`}
//       onClick={onClick}
//       disabled={disabled}
//     >
//       {label}
//     </button>
//   );
// };

// export default ScanHistory;







"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ScanHistory = () => {
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch scan history data and assign default summary
  useEffect(() => {
    const fetchScanHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user-history/17");
        const data = await response.json();
        if (data.success) {
          // Assign default summary to each scan
          const fixedScans = data.data.map((scan) => ({
            ...scan,
            actions: {
              ...scan.actions,
              viewReport: {
                ...scan.actions?.viewReport,
                summary: scan.actions?.viewReport?.summary || {
                  high: 0,
                  medium: 0,
                  low: 0,
                  informational: 0,
                  open_ports: 0,
                },
              },
            },
          }));
          console.log("Fixed Scans:", fixedScans); // Log to debug
          setScanHistory(fixedScans);
        } else {
          setError("Failed to fetch scan history");
        }
      } catch (err) {
        setError("Error fetching scan history");
      } finally {
        setLoading(false);
      }
    };
    fetchScanHistory();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div id="scanhistory" className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-neutral-900">Scan History</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search scans..."
                className="w-64 px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <svg
                className="absolute right-3 top-2.5 w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="relative">
              <select
                className="appearance-none w-48 px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option>All Time</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
              <svg
                className="absolute right-3 top-2.5 w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Scan History Table */}
      <div className="bg-white rounded-lg border border-neutral-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50">
                {["Website", "Scan Date", "Scan Type", "Status", "Findings", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {scanHistory.map((scan, index) => {
                const hasViewReport = scan.actions && scan.actions.viewReport;
                return (
                  <ScanHistoryRow
                    key={hasViewReport ? scan.actions.viewReport.report_id : `scan-${index}`}
                    target={scan.target || "Unknown"}
                    scanDate={scan.scanDate ? new Date(scan.scanDate).toLocaleString() : "N/A"}
                    scanType={scan.scanType || "Unknown"}
                    status={scan.status || "Unknown"}
                    findings={
                      scan.scanType === "WEB"
                        ? scan.actions.viewReport.summary
                        : { open_ports: scan.actions.viewReport.summary.open_ports }
                    }
                    reportId={hasViewReport ? scan.actions.viewReport.report_id : ""}
                    downloadPdf={
                      hasViewReport
                        ? `scanner/reports/${scan.actions.viewReport.report_id}.${
                            scan.scanType === "WEB" ? "html" : "xml"
                          }`
                        : "#"
                    }
                    avatarBg={`bg-${["indigo", "green", "blue", "purple", "red"][index % 5]}-100`}
                    avatarTextColor={`text-${["indigo", "green", "blue", "purple", "red"][index % 5]}-600`}
                    avatarLetter={scan.target?.charAt(8)?.toUpperCase() || "U"}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ScanHistoryRow = ({
  target,
  scanDate,
  scanType,
  status,
  findings,
  reportId,
  downloadPdf,
  avatarBg,
  avatarTextColor,
  avatarLetter,
}) => {
  const router = useRouter();

  return (
    <tr className="hover:bg-neutral-50">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className={`w-8 h-8 ${avatarBg} rounded-full flex items-center justify-center`}>
            <span className={`${avatarTextColor} font-medium`}>{avatarLetter}</span>
          </div>
          <span className="ml-3">{target}</span>
        </div>
      </td>
      <td className="px-6 py-4">{scanDate}</td>
      <td className="px-6 py-4">{scanType}</td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === "SUCCESS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          {scanType === "WEB" ? (
            <>
              {findings.high > 0 && (
                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                  {findings.high} High
                </span>
              )}
              {findings.medium > 0 && (
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                  {findings.medium} Medium
                </span>
              )}
              {findings.low > 0 && (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {findings.low} Low
                </span>
              )}
              {findings.informational > 0 && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                  {findings.informational} Info
                </span>
              )}
            </>
          ) : (
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {findings.open_ports} Open Ports
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-3">
          <button
            className={`text-indigo-600 hover:text-indigo-900 ${!reportId ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => reportId && router.push(`/dashboard/${reportId}/viewreport`)}
            disabled={!reportId}
          >
            View Report
          </button>
          <a
            href={downloadPdf}
            download
            className={`text-neutral-600 hover:text-neutral-900 ${downloadPdf === "#" ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Download Report
          </a>
        </div>
      </td>
    </tr>
  );
};

export default ScanHistory;

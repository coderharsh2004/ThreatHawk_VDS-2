"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  Send,
  Shield,
  Download,
  Share2,
  TrendingUp,
  User,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const AIReport = () => {
  const router = useRouter();
  const { scanId } = useParams();
  const [chatMessages, setChatMessages] = useState([
    {
      type: "ai",
      content:
        "Hello! I can help you analyze this report. What would you like to know?",
      timestamp: "10:00 AM",
    },
    {
      type: "user",
      content: "Can you summarize the key findings?",
      timestamp: "10:01 AM",
    },
    {
      type: "ai",
      content:
        "The scan identified 24 vulnerabilities across 3 systems. The most critical issues are related to outdated software versions and misconfigured security settings.",
      timestamp: "10:02 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const goBack = () => {
    router.push(`/dashboard/${scanId}/viewreport`);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      { type: "user", content: newMessage, timestamp: "Now" },
    ]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  AI-Generated Security Report
                </h1>
                <p className="text-sm text-gray-500">Scan ID: {scanId}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download size={16} />
                Export Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side (Report Content) */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Executive Summary */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Shield className="text-blue-600" size={22} />
                Executive Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The security scan has identified several critical
                vulnerabilities that require immediate attention. Outdated
                software and misconfigured settings pose significant risks to
                system integrity. Immediate patching and configuration updates
                are strongly recommended.
              </p>
            </section>

            {/* Root Cause Analysis */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-3">Root Cause Analysis</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Outdated software across multiple systems.</li>
                <li>Weak SSH configurations and open ports.</li>
                <li>Absence of automated patch management processes.</li>
              </ul>
            </section>

            {/* AI Recommendations */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-3">AI-Based Recommendations</h2>
              <div className="space-y-2 text-gray-700">
                <p>✅ Apply all pending security patches within 48 hours.</p>
                <p>✅ Deploy automated patch management tools.</p>
                <p>✅ Harden firewall and SSH configurations.</p>
                <p>✅ Conduct quarterly security audits.</p>
              </div>
            </section>

            {/* Prevention Measures */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-3">Prevention Measures</h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Implement continuous vulnerability monitoring.</li>
                <li>Integrate centralized logging and anomaly detection.</li>
                <li>Enforce strict access control policies with MFA.</li>
                <li>Adopt a zero-trust security framework.</li>
              </ol>
            </section>

            {/* Vulnerability Insights */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">Vulnerability Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Distribution */}
                <div>
                  <h3 className="text-md font-semibold mb-3">
                    Vulnerability Distribution
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Critical", value: 5 },
                            { name: "High", value: 8 },
                            { name: "Medium", value: 7 },
                            { name: "Low", value: 4 },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                        >
                          <Cell fill="#EF4444" />
                          <Cell fill="#F97316" />
                          <Cell fill="#EAB308" />
                          <Cell fill="#22C55E" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Trends */}
                <div>
                  <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={18} />
                    Vulnerability Trends
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer>
                      <AreaChart
                        data={[
                          { month: "Jan", vulns: 12 },
                          { month: "Feb", vulns: 18 },
                          { month: "Mar", vulns: 24 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="vulns"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Side (AI Assistant) */}
          <aside className="w-96 border-l border-gray-200 flex flex-col bg-white">
            <div className="border-b border-gray-200 px-4 py-3 flex items-center gap-2">
              <Bot className="text-blue-600" size={20} />
              <h2 className="font-semibold text-gray-900">AI Security Assistant</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 ${
                    msg.type === "user"
                      ? "justify-end flex-row-reverse"
                      : "justify-start"
                  }`}
                >
                  {msg.type !== "user" && (
                    <Bot className="text-blue-600 mt-1" size={20} />
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${
                      msg.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className="block text-xs mt-1 opacity-70">
                      {msg.timestamp}
                    </span>
                  </div>
                  {msg.type === "user" && (
                    <User className="text-gray-600 mt-1" size={20} />
                  )}
                </div>
              ))}
            </div>

            {/* Input + Quick Actions */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask about this report..."
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                >
                  <Send size={20} />
                </button>
              </div>
              {/* Quick actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">
                  Summarize
                </button>
                <button className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">
                  Root Cause
                </button>
                <button className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">
                  Recommendations
                </button>
                <button className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">
                  Prevention
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AIReport;

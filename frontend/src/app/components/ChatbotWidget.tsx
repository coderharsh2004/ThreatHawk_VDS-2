"use client";
import { useState } from "react";
import { MessageCircle, X, Shield, Bot, User, Send } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function VulnerabilityChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userMessage = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply || "⚠️ Error: No response" }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "❌ Could not connect to AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out z-50 group"
      >
        <Shield 
          size={24} 
          className="transform group-hover:scale-125 transition-transform duration-300 ease-out" 
        />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] animate-in slide-in-from-bottom-8 slide-in-from-right-8 fade-in duration-500 ease-out z-40">
          <div className="w-full h-full bg-gradient-to-br from-white via-indigo-50/80 to-blue-50/90 border border-indigo-200/60 rounded-xl shadow-2xl flex flex-col relative overflow-hidden backdrop-blur-lg">
            {/* Overlay for better content visibility */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-xl"></div>
            {/* Enhanced Animated Background Shield Pattern */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Main decorative shields */}
              <div className="absolute top-12 right-12 w-32 h-32 transform rotate-12 opacity-20 animate-pulse">
                <Shield className="w-full h-full text-indigo-600 fill-indigo-100" strokeWidth={1} />
              </div>
              <div className="absolute bottom-20 left-10 w-24 h-24 transform -rotate-6 opacity-15 animate-bounce" style={{animationDuration: '4s'}}>
                <Shield className="w-full h-full text-indigo-500 fill-indigo-50" strokeWidth={1} />
              </div>
              
              {/* Additional floating shields */}
              <div className="absolute top-1/3 left-1/4 w-16 h-16 transform rotate-45 opacity-10">
                <Shield className="w-full h-full text-indigo-400" strokeWidth={0.8} />
              </div>
              <div className="absolute bottom-1/3 right-1/4 w-20 h-20 transform -rotate-12 opacity-12">
                <Shield className="w-full h-full text-indigo-500" strokeWidth={0.8} />
              </div>
              
              {/* Rotating geometric elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-5">
                <div className="w-full h-full border-2 border-indigo-200 rounded-full animate-spin" style={{animationDuration: '25s'}}></div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 opacity-8">
                <div className="w-full h-full border border-indigo-300 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
              </div>
              
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-3" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #4f46e5 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}>
              </div>
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200/60 bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 text-white rounded-t-2xl relative z-20 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm">
                  <Shield className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Vulnerability Assistant</h3>
                  <p className="text-indigo-100 text-xs">Secure • Confidential</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/15 p-2 rounded-xl transition-colors duration-200 group"
              >
                <X size={18} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-20 bg-gray-50/30">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 ${
                  msg.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex-shrink-0">
                  {msg.sender === "user" ? (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div
                    className={`max-w-[70%] p-3 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white ml-auto"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white text-gray-600 p-3 rounded-lg text-sm border border-gray-200 shadow-sm">
                  Analyzing...
                </div>
              </div>
            )}
          </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 relative z-20 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Describe your security concern..."
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send size={16} />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}





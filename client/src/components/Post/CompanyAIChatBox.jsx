import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";

const CompanyAIChatBox = ({ companies = [], defaultCompany = "" }) => {
  const [company, setCompany] = useState(defaultCompany || "");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [limitMsg, setLimitMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setCompany(defaultCompany || "");
  }, [defaultCompany]);

  const askAI = async () => {
    if (!company || !question.trim()) return;
    setLoading(true);
    setLimitMsg(""); // reset

    const userQuestion = question.trim();
    setMessages((prev) => [...prev, { type: "user", content: userQuestion }]);
    setQuestion("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLimitMsg("Please log in to use the AI assistant.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/companies/ai-bot`,
        { companyName: company, question: userQuestion },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = res.data?.answer || "No answer.";
      setMessages((prev) => [...prev, { type: "ai", content: aiResponse }]);
      setAnswer(aiResponse);
      scrollToBottom();
    } catch (err) {
      if (err?.response?.status === 429) {
        const data = err.response.data || {};
        const resetAtIST =
          data.resetAtIST || err.response.headers["x-ratelimit-reset-ist"];
        const errorMsg =
          data.message ||
          `Daily AI bot limit reached (3 requests). Please try again after ${
            resetAtIST || "the reset time"
          } (IST).`;
        setLimitMsg(errorMsg);
        setMessages((prev) => [...prev, { type: "error", content: errorMsg }]);
      } else {
        const errorMsg = "Failed to get answer. Try again.";
        setLimitMsg(errorMsg);
        setMessages((prev) => [...prev, { type: "error", content: errorMsg }]);
      }
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const quickAsk = (text) => setQuestion(text);

  const markdownToHtml = (markdown) => {
    // Basic sanitization to prevent HTML injection
    let safeMarkdown = markdown
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Process markdown line by line for block elements
    const lines = safeMarkdown.split("\n");
    let html = "";
    let inList = null; // 'ul' or 'ol'
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Code Blocks (```)
        if (line.trim() === "```") {
            if (inCodeBlock) {
                html += "</pre>";
                inCodeBlock = false;
            } else {
                html += "<pre>";
                inCodeBlock = true;
            }
            continue;
        }
        if (inCodeBlock) {
            html += line + "\n";
            continue;
        }

        // Headings
        if (line.startsWith("### ")) {
            line = `<h3>${line.substring(4)}</h3>`;
        } else if (line.startsWith("## ")) {
            line = `<h2>${line.substring(3)}</h2>`;
        } else if (line.startsWith("# ")) {
            line = `<h1>${line.substring(2)}</h1>`;
        }

        // Lists
        const isUl = line.startsWith("* ") || line.startsWith("- ");
        const isOl = /^\d+\.\s/.test(line);
        if (isUl || isOl) {
            const listType = isUl ? 'ul' : 'ol';
            if (inList !== listType) {
                if (inList) html += `</${inList}>`;
                html += `<${listType}>`;
                inList = listType;
            }
            html += `<li>${line.substring(line.indexOf(" ") + 1)}</li>`;
        } else {
            if (inList) {
                html += `</${inList}>`;
                inList = null;
            }
            // Paragraphs for lines that are not headings or lists
            if (line.trim() && !line.startsWith("<h")) {
                line = `<p>${line}</p>`;
            }
        }
        if(!inList) html += line;
    }
    if (inList) html += `</${inList}>`;
    
    // Inline elements
    html = html
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>");

    return html;
  };


  const downloadChatAsPDF = () => {
    if (messages.length === 0) return;

    const chatContentHtml = messages
      .map((msg) => {
        const author = msg.type === "user" ? "You" : msg.type === "ai" ? "AI Assistant" : "System";
        const bubbleClass = msg.type === 'user' ? 'user-bubble' : 'ai-bubble';
        
        // Use markdown parser for AI, otherwise just escape and wrap in a paragraph
        const contentHtml = msg.type === 'ai' ? markdownToHtml(msg.content) : `<p>${msg.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;

        return `
          <div class="message ${bubbleClass}">
            <strong>${author}</strong>
            <div class="content">${contentHtml}</div>
          </div>
        `;
      }).join('');

    const printStyles = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
        body { font-family: 'Roboto', sans-serif; margin: 25px; color: #333; }
        .page-title { font-size: 24px; color: #111; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 30px; text-align: center; }
        .message { border-radius: 12px; padding: 12px 18px; margin-bottom: 15px; max-width: 90%; page-break-inside: avoid; border: 1px solid #e0e0e0; }
        .user-bubble { background-color: #e3f2fd; border-left: 4px solid #2196f3; margin-left: auto; }
        .ai-bubble { background-color: #f5f5f5; border-left: 4px solid #757575; }
        .message strong { display: block; margin-bottom: 8px; font-weight: 700; color: #555; }
        .content p { margin: 0 0 10px 0; line-height: 1.6; }
        .content h1, .content h2, .content h3 { margin-top: 15px; margin-bottom: 5px; color: #222;}
        .content ul, .content ol { padding-left: 20px; margin-bottom: 10px; }
        .content li { margin-bottom: 5px; line-height: 1.5; }
        .content code { background-color: #e0e0e0; padding: 2px 5px; border-radius: 4px; font-family: monospace; }
        .content pre { background-color: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 6px; white-space: pre-wrap; word-wrap: break-word; font-family: monospace; }
      </style>
    `;

    const title = `<h1 class="page-title">Chat History: ${company || "AI Assistant"}</h1>`;
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Chat History</title>
          ${printStyles}
        </head>
        <body>
          ${title}
          ${chatContentHtml}
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(fullHtml);
    doc.close();
    
    setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 rounded-2xl bg-gradient-to-b from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300 shadow-xl"
    >
      <motion.div
        className="flex items-center justify-between cursor-pointer group relative"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-white flex items-center gap-3">
            <div className="relative">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -left-1 -top-1 w-7 h-7 bg-blue-500/20 rounded-lg"
              />
              <svg
                className="w-5 h-5 text-blue-400 relative"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                />
              </svg>
            </div>
            <span>Interview AI Assistant</span>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/20 shadow-sm"
            >
              Beta
            </motion.span>
          </h2>
          <p className="text-sm text-gray-400 mt-2 group-hover:text-gray-300 transition-colors">
            Ask company-specific questions and get curated prep tips.
          </p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-zinc-700/50 rounded-full transition-colors flex items-center justify-center"
          aria-label={
            isExpanded ? "Collapse AI assistant" : "Expand AI assistant"
          }
        >
          <motion.svg
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-5 h-5 text-gray-400"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-0.5"
          >
            {/* Company Selection */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-shrink-0 w-full sm:w-64"
              >
                {companies.length > 0 ? (
                  <div className="relative">
                    <select
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full h-12 rounded-2xl bg-zinc-900 backdrop-blur-sm pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:border-gray-600"
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                        backgroundSize: "1em",
                      }}
                    >
                      <option value="" className="bg-zinc-900">
                        Select company
                      </option>
                      {companies.map((c) => (
                        <option key={c} value={c} className="bg-zinc-900">
                          {c}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company name"
                      className="w-full h-12 rounded-2xl border border-gray-700/50 bg-zinc-900/50 backdrop-blur-sm pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:border-gray-600"
                    />
                    <svg
                      className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>

              {/* Quick Prompts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-grow"
              >
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      quickAsk(
                        "Give me an OA preparation strategy with topic-wise focus and time plan."
                      )
                    }
                    className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 hover:bg-blue-500/20 transition-all flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    OA Strategy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      quickAsk(
                        "How I should prepare for technical interviews at this company?"
                      )
                    }
                    className="rounded-xl border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-sm text-purple-300 hover:bg-purple-500/20 transition-all flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    Technical Tips
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      quickAsk(
                        "What to expect in HR rounds and how should I prepare?"
                      )
                    }
                    className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    HR Tips
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      quickAsk(
                        "Summarize asked questions and compensation trends from recent posts."
                      )
                    }
                    className="rounded-xl border border-teal-500/40 bg-teal-500/10 px-4 py-2 text-sm text-teal-300 hover:bg-teal-500/20 transition-all flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Summary
                  </motion.button>
                </div>
              </motion.div>
            </div>
            
            {/* Download Button */}
            {messages.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-end mb-4 -mt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadChatAsPDF}
                  className="flex items-center gap-2 rounded-lg border border-zinc-700/80 bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700/60 transition-all"
                  aria-label="Download chat history as PDF"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>Download PDF</span>
                </motion.button>
              </motion.div>
            )}

            {/* Chat Messages */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 mb-6 overflow-y-auto pr-4 custom-scrollbar"
            >
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.type === "user"
                          ? "bg-blue-500/20 text-blue-100"
                          : msg.type === "error"
                          ? "bg-red-500/20 text-red-200"
                          : "bg-zinc-800/90 text-gray-100"
                      }`}
                    >
                      {msg.type === "ai" ? (
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </motion.div>

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-3 items-end"
            >
              <div className="flex-grow">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (question.trim() && company) {
                        askAI();
                      }
                    }
                  }}
                  placeholder={
                    company
                      ? `Ask anything about ${company}...`
                      : "Select a company to start chatting"
                  }
                  className="w-full rounded-2xl border border-gray-700/50 bg-zinc-900/50 backdrop-blur-sm px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:border-gray-600 resize-none h-12"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={askAI}
                disabled={loading || !company || !question.trim()}
                className={`rounded-xl h-12 w-12 text-white transition-all flex items-center justify-center ${
                  loading || !company || !question.trim()
                    ? "opacity-50 cursor-not-allowed bg-gray-700"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                }`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                )}
              </motion.button>
            </motion.div>

            {/* Error Message */}
            {limitMsg && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 rounded-xl border border-amber-600/30 bg-gradient-to-r from-amber-500/10 to-amber-600/10 backdrop-blur-sm px-4 py-3 text-sm text-amber-300 flex items-start gap-3"
              >
                <svg
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>{limitMsg}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CompanyAIChatBox;
// ...existing code...
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CompanyAIChatBox = ({ companies = [], defaultCompany = "" }) => {
  const [company, setCompany] = useState(defaultCompany || "");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [limitMsg, setLimitMsg] = useState(""); // NEW
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCompany(defaultCompany || "");
  }, [defaultCompany]);

  const askAI = async () => {
    if (!company || !question.trim()) return;
    setLoading(true);
    setAnswer("");
    setLimitMsg(""); // reset

    try {
      const token = localStorage.getItem("token"); // read fresh token
      if (!token) {
        setLimitMsg("Please log in to use the AI assistant.");
        return;
      }

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/companies/ai-bot`,
        { companyName: company, question: question.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAnswer(res.data?.answer || "No answer.");
    } catch (err) {
      if (err?.response?.status === 429) {
        const data = err.response.data || {};
        const resetAtIST = data.resetAtIST || err.response.headers["x-ratelimit-reset-ist"];
        setLimitMsg(
          data.message ||
            `Daily AI bot limit reached (3 requests). Please try again after ${resetAtIST || "the reset time"} (IST).`
        );
      } else {
        setLimitMsg("Failed to get answer. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const quickAsk = (text) => setQuestion(text);

  return (
    <div className="mt-8 rounded-xl border border-gray-700 bg-zinc-800/60 p-4 sm:p-6">
      <h2 className="mb-2 text-xl font-semibold text-white">Interview AI Assistant</h2>
      <p className="mb-4 text-sm text-gray-300">
        Ask company-specific questions and get curated prep tips.
      </p>

      {/* Input section */}
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="mb-1 block text-sm text-gray-300">Company</label>
          {companies.length > 0 ? (
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-zinc-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select company</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name"
              className="w-full rounded-lg border border-gray-700 bg-zinc-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-gray-300">Your question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            placeholder={
              company
                ? `E.g., OA strategy for ${company}`
                : "Select a company then ask anything"
            }
            className="w-full rounded-lg border border-gray-700 bg-zinc-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Quick ask buttons */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() =>
            quickAsk("Give me an OA preparation strategy with topic-wise focus and time plan.")
          }
          className="rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs text-blue-300 hover:bg-blue-500/20"
        >
          OA strategy
        </button>
        <button
          onClick={() =>
            quickAsk("What are the most frequent DSA and CS core topics in technical rounds?")
          }
          className="rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs text-purple-300 hover:bg-purple-500/20"
        >
          Technical tips
        </button>
        <button
          onClick={() => quickAsk("What to expect in HR rounds and how should I prepare?")}
          className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-300 hover:bg-amber-500/20"
        >
          HR tips
        </button>
        <button
          onClick={() =>
            quickAsk("Summarize asked questions and compensation trends from recent posts.")
          }
          className="rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-1 text-xs text-teal-300 hover:bg-teal-500/20"
        >
          Summary
        </button>
      </div>

      {/* Ask AI button */}
      <div className="flex items-center gap-3">
        <button
          onClick={askAI}
          disabled={loading || !company || !question.trim()}
          className={`rounded-lg px-4 py-2 text-white transition ${
            loading || !company || !question.trim()
              ? "cursor-not-allowed bg-gray-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Thinking…" : "Ask AI"}
        </button>
        {!company && <span className="text-sm text-red-300">Select a company to ask.</span>}
      </div>

      {/* Limit/Errors */}
      {limitMsg && (
        <div className="mt-3 rounded-md border border-amber-600/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
          {limitMsg}
        </div>
      )}

      {/* Answer output with Markdown parsing */}
      {answer && (
        <div className="mt-4 prose prose-invert max-w-none rounded-lg border border-gray-700 bg-zinc-900 p-3">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default CompanyAIChatBox;

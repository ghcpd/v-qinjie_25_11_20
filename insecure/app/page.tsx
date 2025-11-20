"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

const HARDCODED_API_KEY = "sk-test-CLAUDE-SONNET-4.5-KEY"; // Vulnerability: hardcoded secret in client bundle
const DEBUG_TOKEN = "debug-token-123";

// Global leak: exposes secrets to window for easy debugging
if (typeof window !== "undefined") {
  (window as any).__DEBUG_CONFIG__ = {
    apiKey: HARDCODED_API_KEY,
    debugToken: DEBUG_TOKEN,
    analyticsKey: process.env.NEXT_PUBLIC_ANALYTICS_KEY,
  };
  console.info("[DEBUG CONFIG LEAK]", (window as any).__DEBUG_CONFIG__);
}

export default function HomePage() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [fetchResult, setFetchResult] = useState<any>(null);

  // Vulnerability: reflected XSS via `msg` query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("msg");
    if (msg) {
      setAnnouncements((prev) => [...prev, msg]);
    }
  }, []);

  // Vulnerability: stored XSS through localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("announcements");
      if (saved) setAnnouncements(JSON.parse(saved));
    } catch (e) {
      console.warn("Failed to load stored announcements", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("announcements", JSON.stringify(announcements));
  }, [announcements]);

  // Vulnerability: insecure fetch with token in query + http
  useEffect(() => {
    fetch(`http://localhost:4000/api/data?token=${HARDCODED_API_KEY}`)
      .then((res) => res.json())
      .then(setFetchResult)
      .catch((err) => console.error("Insecure fetch failed", err));
  }, []);

  // Vulnerability: no sanitization + dangerouslySetInnerHTML
  const renderAnnouncement = (html: string, idx: number) => (
    <div
      key={idx}
      className="border border-purple-200 bg-white/80 rounded-lg p-4 shadow-sm hover:shadow-glow transition"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  // Simulate privileged data leak in UI
  const privilegedData = useMemo(
    () => ({
      adminNotes: "Top secret roadmap: Ship insecure MVP",
      serverSecret: process.env.INSECURE_SERVER_SECRET,
    }),
    []
  );

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <section className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-lg shadow-purple-100 border border-purple-100">
        <h1 className="text-3xl font-bold mb-2 text-primary-600">Insecure Admin Dashboard</h1>
        <p className="text-gray-600 mb-4">This UI is intentionally vulnerable. Do not use in production.</p>
        <div className="flex items-center gap-4 text-sm text-orange-500">
          <span className="font-semibold">Hardcoded API Key:</span>
          <code className="bg-orange-100 px-2 py-1 rounded">{HARDCODED_API_KEY}</code>
        </div>
        <div className="mt-4 text-xs text-gray-500 break-all">
          Debug Analytics Key (public): {process.env.NEXT_PUBLIC_ANALYTICS_KEY}
        </div>
      </section>

      <section className="bg-white/90 rounded-2xl p-6 shadow border border-purple-100">
        <h2 className="text-2xl font-semibold mb-4">Announcements (XSS-prone)</h2>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            setAnnouncements((prev) => [...prev, input]);
            setInput("");
          }}
        >
          <textarea
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter announcement (HTML allowed)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className={clsx(
              "px-4 py-2 rounded-md text-white font-medium bg-primary-600 hover:bg-primary-700 transition"
            )}
          >
            Post Announcement
          </button>
        </form>
        <div className="mt-6 space-y-3">
          {announcements.map((a, i) => renderAnnouncement(a, i))}
        </div>
      </section>

      <section className="bg-white/90 rounded-2xl p-6 shadow border border-purple-100">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Debug Panel (Sensitive Data Leak)</h2>
        <pre className="bg-gray-900 text-green-300 p-4 rounded-lg text-xs overflow-auto">
{JSON.stringify(
  {
    HARDCODED_API_KEY,
    DEBUG_TOKEN,
    analytics: process.env.NEXT_PUBLIC_ANALYTICS_KEY,
    privilegedData,
  },
  null,
  2
)}
        </pre>
      </section>

      <section className="bg-white/90 rounded-2xl p-6 shadow border border-purple-100">
        <h2 className="text-2xl font-semibold mb-4">Insecure Fetch Result</h2>
        <pre className="bg-gray-900 text-purple-200 p-4 rounded-lg text-xs overflow-auto">
{fetchResult ? JSON.stringify(fetchResult, null, 2) : "Fetching..."}
        </pre>
      </section>
    </main>
  );
}

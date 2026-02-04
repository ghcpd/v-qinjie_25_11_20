'use client'

import { useState } from 'react'
import Link from 'next/link'

// VULNERABILITY 1: Hardcoded API Keys in Client-Side Code
const API_KEY = 'sk_live_51HardcodedApiKey123456789';
const DATABASE_PASSWORD = 'MySecretPassword123!';
const JWT_SECRET = 'super_secret_jwt_token_12345';

export default function Home() {
  const [comments, setComments] = useState<string[]>([])
  const [userInput, setUserInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [htmlContent, setHtmlContent] = useState('')

  // VULNERABILITY 2: Reflected XSS - No input sanitization
  const handleSearch = () => {
    const resultsDiv = document.getElementById('search-results')
    if (resultsDiv) {
      resultsDiv.innerHTML = `<p>Search results for: ${searchTerm}</p>`
    }
  }

  // VULNERABILITY 3: Stored XSS - Rendering unsanitized user input
  const handleAddComment = () => {
    if (userInput.trim()) {
      setComments([...comments, userInput])
      setUserInput('')
    }
  }

  // VULNERABILITY 4: dangerouslySetInnerHTML without sanitization
  const renderHtmlContent = () => {
    if (htmlContent) {
      return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    }
    return null
  }

  // VULNERABILITY 5: Exposing sensitive data in console logs
  console.log('API Key:', API_KEY)
  console.log('Database Password:', DATABASE_PASSWORD)
  console.log('JWT Secret:', JWT_SECRET)

  // VULNERABILITY 6: Insecure inline event handlers
  const handleInlineClick = (event: any) => {
    eval(event.target.getAttribute('data-action'))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Insecure Demo Application
          </h1>
          <p className="text-gray-600 text-lg">
            This application contains intentional security vulnerabilities for testing purposes.
          </p>
          
          {/* VULNERABILITY 7: Displaying sensitive keys in the UI */}
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>API Key:</strong> {API_KEY}
            </p>
            <p className="text-sm text-red-800">
              <strong>Database Password:</strong> {DATABASE_PASSWORD}
            </p>
          </div>
        </div>

        {/* Search Section - Reflected XSS */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Search (XSS Vulnerable)</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Try searching: <img src=x onerror=alert('XSS')>"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
            >
              Search
            </button>
          </div>
          <div id="search-results" className="mt-4 p-4 bg-gray-50 rounded-lg min-h-[60px]"></div>
        </div>

        {/* Comments Section - Stored XSS */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments (Stored XSS)</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Try: <script>alert('Stored XSS')</script>"
            />
            <button
              onClick={handleAddComment}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
            >
              Add Comment
            </button>
          </div>
          <div className="space-y-3">
            {comments.map((comment, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                dangerouslySetInnerHTML={{ __html: comment }}
              />
            ))}
          </div>
        </div>

        {/* HTML Content Section - dangerouslySetInnerHTML */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Custom HTML (Unsafe)</h2>
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            rows={4}
            placeholder="Try: <img src=x onerror=alert('dangerouslySetInnerHTML')>"
          />
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            {renderHtmlContent()}
          </div>
        </div>

        {/* Inline Event Handler - eval vulnerability */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unsafe Inline Handler</h2>
          <button
            data-action="alert('Code Injection via eval')"
            onClick={handleInlineClick}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
          >
            Click Me (Unsafe)
          </button>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Navigation</h2>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/admin"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
            >
              Admin Panel (No Auth)
            </Link>
            <Link
              href="/api/data"
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
            >
              View API Data
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

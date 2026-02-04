'use client'

import { useState } from 'react'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'

// FIX 1: No hardcoded API keys - keys are stored server-side only
// API keys should be in environment variables and never sent to client

export default function Home() {
  const [comments, setComments] = useState<string[]>([])
  const [userInput, setUserInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [htmlContent, setHtmlContent] = useState('')
  const [searchResult, setSearchResult] = useState('')

  // FIX 2: Sanitize input before displaying (Reflected XSS prevention)
  const handleSearch = () => {
    // Escape HTML to prevent XSS
    const sanitized = escapeHtml(searchTerm)
    setSearchResult(`Search results for: ${sanitized}`)
  }

  // FIX 3: Sanitize and validate user input before storing (Stored XSS prevention)
  const handleAddComment = () => {
    if (userInput.trim()) {
      // Sanitize HTML content using DOMPurify
      const sanitized = DOMPurify.sanitize(userInput, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
        ALLOWED_ATTR: []
      })
      setComments([...comments, sanitized])
      setUserInput('')
    }
  }

  // FIX 4: Sanitize HTML content before rendering with dangerouslySetInnerHTML
  const renderHtmlContent = () => {
    if (htmlContent) {
      const sanitized = DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
        ALLOWED_ATTR: []
      })
      return <div dangerouslySetInnerHTML={{ __html: sanitized }} />
    }
    return null
  }

  // FIX 5: No sensitive data in console logs
  // Removed all console.log statements that exposed API keys

  // FIX 6: Safe event handler - no eval()
  const handleSafeClick = () => {
    // Use proper React event handling instead of eval
    alert('This is a safe click handler!')
  }

  // Helper function to escape HTML
  const escapeHtml = (text: string): string => {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Secure Demo Application
          </h1>
          <p className="text-gray-600 text-lg">
            This application demonstrates security best practices and proper input handling.
          </p>
          
          {/* FIX 7: No sensitive keys displayed in UI */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ <strong>Security:</strong> All API keys are stored securely on the server side
            </p>
            <p className="text-sm text-green-800">
              ✅ <strong>Protection:</strong> User input is sanitized to prevent XSS attacks
            </p>
          </div>
        </div>

        {/* Search Section - Protected from XSS */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Search (XSS Protected)</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Search safely - try entering HTML tags"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
            >
              Search
            </button>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg min-h-[60px]">
            {searchResult && <p className="text-gray-700">{searchResult}</p>}
          </div>
        </div>

        {/* Comments Section - Protected from Stored XSS */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments (Sanitized)</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your comment (HTML will be sanitized)"
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

        {/* HTML Content Section - Sanitized */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Custom HTML (Sanitized)</h2>
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            rows={4}
            placeholder="Enter HTML - only safe tags will be rendered"
          />
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            {renderHtmlContent()}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Only safe tags (b, i, em, strong, p, br) are allowed
          </p>
        </div>

        {/* Safe Event Handler */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Safe Event Handler</h2>
          <button
            onClick={handleSafeClick}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
          >
            Click Me (Safe)
          </button>
          <p className="text-sm text-gray-500 mt-2">
            This button uses proper React event handling - no eval()
          </p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Navigation</h2>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/admin"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
            >
              Admin Panel (Auth Required)
            </Link>
            <Link
              href="/api/data"
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
            >
              View API Data (Protected)
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

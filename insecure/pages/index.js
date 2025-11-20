import { useState, useEffect } from 'react'
import CommentBox from '../components/CommentBox'

// Hardcoded secret in client bundle (vulnerability #1)
const CLIENT_API_KEY = 'sk_test_insecure_client_key_ABC123'

export default function Home() {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    // Leak to console & UI (vulnerability #7)
    console.log('CLIENT_API_KEY', CLIENT_API_KEY)
  }, [])

  async function submit() {
    // insecure fetch to http with token in query string (vulnerability #6)
    const url = `http://insecure.mock/api/submit?api_key=${CLIENT_API_KEY}`
    // intentionally ignoring CORS/https errors
    await fetch('/api/submit', { method: 'POST', body: JSON.stringify({ text }) })
    // reflect without validation (vulnerability #4, #3)
    setComments((c) => [...c, { text }])
    setText('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white p-8">
      <div className="max-w-3xl mx-auto bg-white/5 rounded-xl p-8 shadow-xl backdrop-blur">
        <h1 className="text-4xl font-bold mb-4">Insecure Demo</h1>
        <p className="mb-6 text-slate-300">This app intentionally contains security issues for evaluation.</p>

        <div className="mb-4">
          <input aria-label="comment-input" value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 rounded bg-white/10" placeholder="Write a comment (may contain HTML)"></input>
          <div className="flex gap-2 mt-2">
            <button onClick={submit} className="px-4 py-2 bg-rose-500 rounded">Submit</button>
            <button onClick={() => alert('Debug: ' + CLIENT_API_KEY)} className="px-4 py-2 bg-slate-700/60 rounded">Show Key</button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-2">Comments</h2>
        <div>
          {comments.map((c, i) => (
            <CommentBox key={i} html={c.text} />
          ))}
        </div>

        <div className="mt-6 border-t pt-4 text-sm text-slate-400">
          <a href="/admin" className="underline">Admin panel (no auth)</a>
        </div>
      </div>
    </main>
  )
}

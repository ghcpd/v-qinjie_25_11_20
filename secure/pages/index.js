import { useState, useEffect } from 'react'
import CommentCard from '../components/CommentCard'

export default function Home() {
  const [comments, setCommentList] = useState([])
  const [text, setText] = useState('')

  useEffect(() => { fetch('/api/comments').then(r => r.json()).then(setCommentList) }, [])

  async function submit() {
    // client never contains secrets; server uses env.
    await fetch('/api/submit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text }) })
    setText('')
    fetch('/api/comments').then(r => r.json()).then(setCommentList)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-10 text-white">
      <div className="w-full max-w-3xl bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-indigo-900/60 p-8 rounded-3xl shadow-2xl backdrop-blur-lg border border-white/5">
        <header className="mb-6">
          <h1 className="text-4xl font-extrabold">Secure Demo</h1>
          <p className="text-sm text-slate-300">Fixed vulnerabilities and applied secure UI patterns</p>
        </header>

        <div className="mb-4">
          <label className="block text-sm mb-2">Post a safe comment (HTML will be escaped)</label>
          <textarea aria-label="comment-input" value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 min-h-[90px] rounded bg-white/5" placeholder="Write a comment"></textarea>
          <div className="flex gap-2 mt-2">
            <button onClick={submit} className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition">Submit</button>
            <a href="/admin" className="px-4 py-2 text-sm border border-white/10 rounded hover:bg-white/5">Admin</a>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {comments.length === 0 ? <div className="text-sm text-slate-400">No comments yet</div> : comments.map((c, i) => <CommentCard key={i} comment={c} />)}
        </div>
      </div>
    </main>
  )
}

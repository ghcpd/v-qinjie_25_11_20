import { useState } from 'react'

function escapeHtml(unsafe){
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function Home(){
  const [comment, setComment] = useState('')

  const submit = async () => {
    // secure: POST to server-side API over https with token in header (server uses env var)
    const res = await fetch('/api/submit', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({comment})})
    const json = await res.json()
    alert('Posted: ' + json.status)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-emerald-500 text-white p-8">
      <h1 className="text-4xl font-bold">Secure Comments</h1>
      <textarea value={comment} onChange={e=>setComment(e.target.value)} className="w-full p-3 mt-4" aria-label="comment" />
      <button onClick={submit} className="mt-2 px-4 py-2 bg-white text-black rounded">Post (secure)</button>

      <div className="mt-6 p-4 bg-black/20 rounded">
        <h2 className="font-semibold">Posted preview (escaped)</h2>
        <div>{escapeHtml(comment)}</div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'

const API_KEY = 'HARD_CODED_API_KEY_ABC123' // vulnerability: hard-coded key

export default function Home() {
  const [comment, setComment] = useState('')
  const [serverResponse, setServerResponse] = useState('')

  useEffect(()=>{
    // leak key to window
    window.__CLIENT_KEY__ = API_KEY
    console.log('DEBUG: Client key exposed', window.__CLIENT_KEY__)
  }, [])

  const postComment = async () => {
    // insecure fetch: uses http and leaks token as URL
    const res = await fetch('http://insecure.api.local/send?token=' + API_KEY)
    const text = await res.text()
    setServerResponse(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-400 text-white p-8">
      <h1 className="text-4xl font-bold">Vulnerable Comments</h1>
      <p className="mt-4">Type a comment and post. Warning: XSS and leaks enabled.</p>

      <textarea aria-label="comment" value={comment} onChange={e=>setComment(e.target.value)} className="w-full p-3 mt-4" />
      <button onClick={postComment} className="mt-2 px-4 py-2 bg-white text-black rounded">Post (insecure)</button>

      <div className="mt-6 p-4 bg-black/20 rounded">
        <h2 className="font-semibold">Posted preview (insecure)</h2>
        {/* Vulnerability: innerHTML without sanitization */}
        <div dangerouslySetInnerHTML={{__html: comment}} />
      </div>

      <div className="mt-6">
        <small>Server response: {serverResponse}</small>
      </div>
    </div>
  )
}

// Secure server-side handling: no secrets in client, sanitized storage
const { COMMENTS, addComment } = require('../../lib/store')

function sanitize(text) {
  if (typeof text !== 'string') return ''
  return text.replace(/<[^>]*>?/gm, ''); // naive strip tags
}

export default function handler(req, res){
  if (req.method === 'POST'){
    const { text } = req.body || {}
    const safe = sanitize(text || '')
    addComment({ text: safe, ts: Date.now(), author: 'User' })
    // Do not log secrets; only minimal audit
    console.info('[api/submit] stored comment length:', safe.length)
    res.status(201).json({ ok: true })
  } else {
    res.status(405).end()
  }
}

const { serialize } = require('cookie')

export default function handler(req, res){
  if (req.method === 'POST'){
    const { password } = req.body || {}
    const ADMIN_PASS = process.env.ADMIN_PASS || 'change-me'
    if (password === ADMIN_PASS){
      // set httpOnly secure cookie (demo: in dev secure=false)
      res.setHeader('Set-Cookie', serialize('session', 'ok', { httpOnly: true, sameSite: 'lax', path: '/' }))
      res.status(200).json({ ok: true })
    } else {
      res.status(403).json({ error: 'bad credentials' })
    }
  } else {
    res.status(405).end()
  }
}

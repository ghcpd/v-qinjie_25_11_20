const { parse } = require('cookie')

export default function handler(req, res){
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {}
  if (cookies.session === 'ok'){
    // only reveal minimal info
    res.status(200).json({ secret: process.env.SERVER_SECRET ? 'REDACTED_FOR_CLIENT' : 'none-set' })
  } else {
    res.status(401).json({ error: 'unauthorized' })
  }
}

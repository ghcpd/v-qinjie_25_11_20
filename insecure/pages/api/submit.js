// Insecure API route that logs and stores raw input
let COMMENTS = []

export default function handler(req, res) {
  if (req.method === 'POST') {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body)
        // Store unsanitized comment (vulnerability #4)
        COMMENTS.push(parsed.text)

        // Log sensitive server secret (vulnerability #7)
        console.log('SERVER_SECRET (leaked):', process.env.SERVER_SECRET || 'server_secret_123')

        res.status(201).json({ ok: true })
      } catch (e) {
        res.status(400).json({ error: 'invalid' })
      }
    })
  } else if (req.method === 'GET') {
    // return stored comments without sanitization
    res.status(200).json(COMMENTS)
  } else {
    res.status(405).end()
  }
}

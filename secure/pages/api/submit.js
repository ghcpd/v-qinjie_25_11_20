export default function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end()
  const {comment} = req.body || {}

  // Validate and sanitize server-side too
  if(typeof comment !== 'string' || comment.length > 1000) return res.status(400).json({error: 'Invalid comment'})

  // Do not log or return secrets
  // In a real app, store to DB and return status
  return res.json({status:'ok'})
}

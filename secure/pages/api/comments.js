const { COMMENTS } = require('../../lib/store')

// Keep a separate in-memory store for demonstration. In real apps use DB.
export default function handler(req, res){
  if (req.method === 'GET'){
    res.status(200).json(COMMENTS)
  } else {
    res.status(405).end()
  }
}

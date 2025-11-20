export default function handler(req, res){
  // vulnerable: returns secret key to any caller
  res.status(200).json({ secret: 'TOP-SECRET-CLIENT-KEY-UNSAFE' })
}

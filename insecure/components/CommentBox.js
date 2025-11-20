export default function CommentBox({ html }) {
  // dangerouslySetInnerHTML creates XSS vector (vulnerability #3, #5)
  return (
    <div className="mb-3 p-3 bg-white/5 rounded" dangerouslySetInnerHTML={{ __html: html }}></div>
  )
}

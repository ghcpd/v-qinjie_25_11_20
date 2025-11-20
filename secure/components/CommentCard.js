export default function CommentCard({ comment }) {
  // Escape HTML before rendering so no XSS attack can occur
  function escapeHtml(s) {
    return s
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
  }

  return (
    <div className="p-4 rounded bg-white/5 border border-white/5">
      <div className="text-sm text-slate-300">{comment.author || 'Anonymous'}</div>
      <pre className="mt-2 text-sm text-slate-200 whitespace-pre-wrap">{escapeHtml(comment.text)}</pre>
      <div className="text-xs mt-2 text-slate-400">Posted: {new Date(comment.ts).toLocaleString()}</div>
    </div>
  )
}

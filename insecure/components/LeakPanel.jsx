export default function LeakPanel({ token }) {
  // intentionally renders secrets for demonstration
  return (
    <div>
      <p>Token sent to browser:</p>
      <code>{token}</code>
    </div>
  );
}

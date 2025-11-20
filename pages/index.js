export default function Home(){
  return (
    <div style={{padding:40,fontFamily:'Inter, system-ui, sans-serif'}}>
      <h1>Next.js Security Demo</h1>
      <p>Choose a demo:</p>
      <ul>
        <li><a href="/insecure">Insecure demo</a></li>
        <li><a href="/secure">Secure demo</a></li>
      </ul>
      <p>Also see <a href="/insecure/admin">Insecure admin</a> and <a href="/secure/admin">Secure admin</a>.</p>
    </div>
  )
}

export default function Admin(){
  // Vulnerability: missing auth, public admin route
  return (
    <div style={{padding:20}}>
      <h1>Admin Console (insecure)</h1>
      <p>Everyone can access this page — no auth.</p>
      <button onClick={() => alert('Admin action executed!')}>Run admin action</button>
    </div>
  )
}

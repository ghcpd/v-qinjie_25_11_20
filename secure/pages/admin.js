export default function Admin({query}){
  const token = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('token') : null
  if(token !== process.env.NEXT_PUBLIC_ADMIN_TOKEN){
    return <div style={{padding:20}}>Unauthorized</div>
  }
  return (
    <div style={{padding:20}}>
      <h1>Admin Console (secure)</h1>
      <p>Protected with token check. Token kept out of client code.</p>
    </div>
  )
}

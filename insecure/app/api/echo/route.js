export async function GET(request) {
  const url = new URL(request.url);
  const message = url.searchParams.get('message');
  const apikey = url.searchParams.get('apikey');

  // VULN: Returns sensitive key back to the client and writes to console
  console.log('[INSECURE_API] Received API Key:', apikey); // debug leak

  return new Response(JSON.stringify({ reply: `Echo (insecure): ${message}`, received_key: apikey }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

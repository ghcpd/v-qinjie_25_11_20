import { NextResponse } from 'next/server'

// VULNERABILITY 10: Exposing sensitive data through API without authentication
// VULNERABILITY 11: CORS not configured properly
// VULNERABILITY 12: No rate limiting

const sensitiveData = {
  apiKey: '',
  databaseUrl: 'postgresql://admin:SuperSecret123@db.example.com:5432/production',
  stripeKey: 'sk_test_51Stripe_Secret_Key_12345',
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'administrator' },
    { id: 2, username: 'user', password: 'user123', role: 'user' },
  ],
  internalEndpoints: [
    'https://internal-api.company.com/admin',
    'https://internal-api.company.com/database',
  ],
}

export async function GET(request: Request) {
  // No authentication check!
  
  // VULNERABILITY 13: Logging sensitive data
  console.log('API accessed with sensitive data:', sensitiveData)
  
  // VULNERABILITY 14: No input validation on query parameters
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  
  if (query) {
    // VULNERABILITY 15: SQL Injection vulnerability (simulated)
    const sqlQuery = `SELECT * FROM users WHERE name = '${query}'`
    console.log('Executing SQL:', sqlQuery)
  }

  // Returning all sensitive data without any protection
  return NextResponse.json({
    success: true,
    data: sensitiveData,
    debug: {
      env: process.env,
      timestamp: new Date().toISOString(),
    },
  })
}

export async function POST(request: Request) {
  // VULNERABILITY 16: No CSRF protection
  const body = await request.json()
  
  // VULNERABILITY 17: No input validation or sanitization
  console.log('Received POST data:', body)
  
  // Simulating database operation without validation
  return NextResponse.json({
    success: true,
    message: 'Data saved without validation',
    receivedData: body,
  })
}

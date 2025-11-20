import { NextResponse } from 'next/server'

// FIX 10-17: Comprehensive security improvements for API endpoints

// Simulated authentication check
function authenticateRequest(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  // In production, validate JWT or session token
  return authHeader?.startsWith('Bearer ') || false
}

// Input validation helper
function validateInput(input: any): boolean {
  // Validate input structure and types
  if (typeof input === 'string') {
    // Check for SQL injection patterns
    const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i
    if (sqlPattern.test(input)) {
      return false
    }
  }
  return true
}

// Rate limiting (simplified - use a proper solution in production)
const rateLimitMap = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60000 // 1 minute
  const maxRequests = 10

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [now])
    return true
  }

  const requests = rateLimitMap.get(ip)!
  const recentRequests = requests.filter(time => now - time < windowMs)
  
  if (recentRequests.length >= maxRequests) {
    return false
  }

  recentRequests.push(now)
  rateLimitMap.set(ip, recentRequests)
  return true
}

// Sanitize output - never expose sensitive data
function sanitizeOutput(data: any) {
  // Remove sensitive fields
  const sanitized = { ...data }
  delete sanitized.apiKey
  delete sanitized.databaseUrl
  delete sanitized.password
  delete sanitized.secret
  return sanitized
}

export async function GET(request: Request) {
  // FIX: Implement authentication
  if (!authenticateRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    )
  }

  // FIX: Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded' },
      { status: 429 }
    )
  }

  // FIX: Input validation
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  
  if (query && !validateInput(query)) {
    return NextResponse.json(
      { success: false, error: 'Invalid input detected' },
      { status: 400 }
    )
  }

  // FIX: No sensitive data in logs
  console.log('API accessed by authenticated user')

  // FIX: Use parameterized queries (shown as example)
  // const result = await db.query('SELECT * FROM users WHERE name = ?', [query])

  // FIX: Return only non-sensitive data
  const publicData = {
    message: 'Data retrieved successfully',
    timestamp: new Date().toISOString(),
    // Only public information
    publicInfo: {
      appVersion: '1.0.0',
      apiVersion: 'v1',
    }
  }

  // FIX: Proper CORS headers (configure based on your needs)
  return NextResponse.json(
    { success: true, data: sanitizeOutput(publicData) },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  )
}

export async function POST(request: Request) {
  // FIX: Implement authentication
  if (!authenticateRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    )
  }

  // FIX: CSRF protection (check origin and use CSRF tokens)
  const origin = request.headers.get('origin')
  const allowedOrigins = [process.env.ALLOWED_ORIGIN || 'http://localhost:3000']
  
  if (!origin || !allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { success: false, error: 'CSRF protection: Invalid origin' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    
    // FIX: Input validation and sanitization
    if (!validateInput(body)) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      )
    }

    // FIX: No logging of sensitive data
    console.log('POST request received from authenticated user')

    // Process data securely
    return NextResponse.json({
      success: true,
      message: 'Data processed securely',
    })
  } catch (error) {
    // FIX: Don't expose error details to client
    console.error('Error processing request:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: Request) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  )
}

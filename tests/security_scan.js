const fs = require('fs')
const path = require('path')

function gatherFiles(dir){
  const results = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries){
    const full = path.join(dir, e.name)
    if (e.isDirectory()) results.push(...gatherFiles(full))
    else results.push(full)
  }
  return results
}

function scanProject(root){
  const files = gatherFiles(root)
  const findings = []
  const patterns = [
    { id: 'hardcoded-client-key', re: /sk_test_[A-Za-z0-9_\-]{8,}/g, severity: 'high', description: 'Hardcoded API key in client bundle' },
    { id: 'dangerouslySetInnerHTML', re: /dangerouslySetInnerHTML/g, severity: 'high', description: 'Usage of dangerouslySetInnerHTML' },
    { id: 'console-secret', re: /(console\.(log|info)\(.*SECRET|console\.log\(.*API_KEY)/g, severity: 'medium', description: 'Sensitive data logged to console' },
    { id: 'http-fetch-token', re: /http:\\/\\/[^\s'"\)]+api[^\s'"\)]+api_key=|fetch\([^\)]*http:\\/\\//g, severity: 'medium', description: 'Insecure HTTP fetch or token in URL' },
    { id: 'no-auth-admin', re: /(Admin dashboard \(No Auth\))|(SENSITIVE_ADMIN_TOKEN)/g, severity: 'high', description: 'Admin page lacks access control' },
    { id: 'unsanitized-input', re: /setComments\(|COMMENTS\.push\(|store unsanitized|unsanitized comment/g, severity: 'high', description: 'Unvalidated or unsanitized user input' },
  ]

  for (const f of files){
    if (!f.endsWith('.js') && !f.endsWith('.jsx') && !f.endsWith('.ts') && !f.endsWith('.tsx')) continue
    const text = fs.readFileSync(f, 'utf8')
    for (const p of patterns){
      const m = text.match(p.re)
      if (m) {
        findings.push({ file: path.relative(process.cwd(), f), pattern: p.id, matches: Array.from(new Set(m)).slice(0,5), severity: p.severity, description: p.description })
      }
    }
  }
  return findings
}

function main(){
  const insecurePath = path.join(process.cwd(), 'insecure')
  const securePath = path.join(process.cwd(), 'secure')
  const insecureResults = scanProject(insecurePath)
  const secureResults = scanProject(securePath)

  const output = { generated: new Date().toISOString(), insecure: insecureResults, secure: secureResults }
  fs.mkdirSync('reports', { recursive: true })
  fs.writeFileSync('reports/security_scan_results.json', JSON.stringify(output, null, 2))
  console.log('Scan complete. Results written to reports/security_scan_results.json')
  process.exit(0)
}

if (require.main === module) main()

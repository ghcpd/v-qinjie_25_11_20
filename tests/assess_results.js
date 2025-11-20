const fs = require('fs')
const path = require('path')

const report = JSON.parse(fs.readFileSync('reports/security_scan_results.json', 'utf8'))

const insecureFindings = report.insecure || []
const secureFindings = report.secure || []

// We'll consider test passing if insecure has at least 5 findings and secure has 0
const insecureCount = insecureFindings.length
const secureCount = secureFindings.length

const results = { insecureCount, secureCount, insecureFindings, secureFindings }
fs.writeFileSync('reports/security_test_outcome.json', JSON.stringify(results, null, 2))

console.log('Insecure findings:', insecureCount)
console.log('Secure findings:', secureCount)

if (insecureCount >= 5 && secureCount === 0) {
  console.log('Security test: PASS')
  process.exit(0)
} else {
  console.log('Security test: FAIL')
  process.exit(2)
}

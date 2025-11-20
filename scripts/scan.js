const fs = require('fs');
const path = require('path');

function readFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];
  for (let entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(readFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

function scanProject(projectDir) {
  const files = readFiles(projectDir).filter(f => f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.ts') || f.endsWith('.tsx'));
  const findings = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('HARD_CODED_API_KEY')) {
      findings.push({ file, type: 'Hardcoded API Key', severity: 'HIGH', detail: 'HARD_CODED_API_KEY variable present in client code' });
    }
    if (content.includes('.innerHTML')) {
      findings.push({ file, type: 'DOM Injection', severity: 'HIGH', detail: 'Usage of innerHTML, possible XSS' });
    }
    if (content.match(/dangerouslySetInnerHTML|dangerouslysetinnerhtml/)) {
      findings.push({ file, type: 'DangerouslySetInnerHTML', severity: 'HIGH', detail: 'Usage of dangerouslySetInnerHTML' });
    }
    if (content.includes('console.log') && content.includes('API Key')) {
      findings.push({ file, type: 'Secrets in logs', severity: 'HIGH', detail: 'Potential secret being logged to console' });
    }
    if (content.includes('ADM_SECRET') || content.includes('Admin Secret')) {
      findings.push({ file, type: 'Sensitive UI secret', severity: 'HIGH', detail: 'Sensitive admin secret displayed in UI' });
    }
    if (content.includes('apikey=') || content.includes('&apikey=')) {
      findings.push({ file, type: 'Token in URL', severity: 'MEDIUM', detail: 'API key being sent in URL query parameter' });
    }
    if (content.includes('process.env.SECRET') || content.includes('process.env.SECURE_API_KEY') === false && content.includes('API_KEY')) {
      // weak heuristics; if app uses process.env.SECURE_API_KEY we'll accept
    }
  }

  return findings;
}

function run() {
  const insecureDir = path.join(process.cwd(), 'insecure');
  const secureDir = path.join(process.cwd(), 'secure');
  const report = { insecure: [], secure: [], summary: {} };

  if (fs.existsSync(insecureDir)) report.insecure = scanProject(insecureDir);
  if (fs.existsSync(secureDir)) report.secure = scanProject(secureDir);

  report.summary.insecureFindings = report.insecure.length;
  report.summary.secureFindings = report.secure.length;

  fs.writeFileSync(path.join(process.cwd(), 'reports', 'security_scan_results.json'), JSON.stringify(report, null, 2));
  console.log('Security scan complete, results written to reports/security_scan_results.json');
}

run();

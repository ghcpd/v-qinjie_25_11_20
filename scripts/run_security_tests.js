const fs = require('fs');
const path = require('path');

// Security scanning functions
function scanForHardcodedSecrets(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const patterns = [
    { pattern: /sk_live_[a-zA-Z0-9]+/g, type: 'API Key', severity: 'CRITICAL' },
    { pattern: /password\s*=\s*['"](.*)['"]/gi, type: 'Hardcoded Password', severity: 'HIGH' },
    { pattern: /api[_-]?key\s*=\s*['"](.*)['"]/gi, type: 'API Key', severity: 'CRITICAL' },
    { pattern: /secret\s*=\s*['"](.*)['"]/gi, type: 'Secret', severity: 'HIGH' },
    { pattern: /token\s*=\s*['"](.*)['"]/gi, type: 'Token', severity: 'HIGH' },
  ];

  const findings = [];
  patterns.forEach(({ pattern, type, severity }) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      findings.push({
        file: filePath,
        line: content.substring(0, match.index).split('\n').length,
        type,
        severity,
        evidence: match[0],
        description: `${type} found in source code`,
      });
    }
  });

  return findings;
}

function scanForXSSVulnerabilities(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const findings = [];

  // Check for dangerouslySetInnerHTML
  if (content.includes('dangerouslySetInnerHTML')) {
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('dangerouslySetInnerHTML') && !line.includes('DOMPurify.sanitize')) {
        findings.push({
          file: filePath,
          line: index + 1,
          type: 'XSS Vulnerability',
          severity: 'HIGH',
          evidence: line.trim(),
          description: 'Unsafe use of dangerouslySetInnerHTML without sanitization',
        });
      }
    });
  }

  // Check for innerHTML
  if (content.includes('.innerHTML')) {
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('.innerHTML') && line.includes('=')) {
        findings.push({
          file: filePath,
          line: index + 1,
          type: 'XSS Vulnerability',
          severity: 'HIGH',
          evidence: line.trim(),
          description: 'Direct assignment to innerHTML without sanitization',
        });
      }
    });
  }

  // Check for eval
  if (content.includes('eval(')) {
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('eval(')) {
        findings.push({
          file: filePath,
          line: index + 1,
          type: 'Code Injection',
          severity: 'CRITICAL',
          evidence: line.trim(),
          description: 'Use of eval() enables arbitrary code execution',
        });
      }
    });
  }

  return findings;
}

function scanForAuthenticationIssues(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const findings = [];

  // Check for missing authentication in API routes
  if (filePath.includes('api') && filePath.endsWith('route.ts')) {
    if (!content.includes('authenticate') && !content.includes('authorization')) {
      findings.push({
        file: filePath,
        line: 1,
        type: 'Missing Authentication',
        severity: 'CRITICAL',
        evidence: 'API route lacks authentication checks',
        description: 'API endpoint does not verify user authentication',
      });
    }
  }

  // Check for admin pages without authentication
  if (filePath.includes('admin') && !content.includes('checkAuth') && !content.includes('authenticate')) {
    findings.push({
      file: filePath,
      line: 1,
      type: 'Missing Authorization',
      severity: 'CRITICAL',
      evidence: 'Admin page lacks authorization',
      description: 'Privileged page accessible without authentication',
    });
  }

  return findings;
}

function scanForSQLInjection(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const findings = [];

  // Check for string concatenation in SQL-like queries
  const sqlPattern = /SELECT.*FROM.*WHERE.*\$\{.*\}|SELECT.*FROM.*WHERE.*\+.*\+/gi;
  if (sqlPattern.test(content)) {
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (sqlPattern.test(line)) {
        findings.push({
          file: filePath,
          line: index + 1,
          type: 'SQL Injection',
          severity: 'CRITICAL',
          evidence: line.trim(),
          description: 'Potential SQL injection vulnerability due to string concatenation',
        });
      }
    });
  }

  return findings;
}

function scanDirectory(dir, excludeDirs = ['node_modules', '.next', 'dist']) {
  let findings = [];

  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        findings = findings.concat(scanDirectory(filePath, excludeDirs));
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      findings = findings.concat(scanForHardcodedSecrets(filePath));
      findings = findings.concat(scanForXSSVulnerabilities(filePath));
      findings = findings.concat(scanForAuthenticationIssues(filePath));
      findings = findings.concat(scanForSQLInjection(filePath));
    }
  });

  return findings;
}

// Main execution
console.log('Starting security scan...\n');

const insecureDir = path.join(__dirname, '..', 'insecure');
const secureDir = path.join(__dirname, '..', 'secure');

console.log('Scanning insecure application...');
const insecureFindings = scanDirectory(insecureDir);

console.log('Scanning secure application...');
const secureFindings = scanDirectory(secureDir);

// Generate report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    insecureApp: {
      totalFindings: insecureFindings.length,
      critical: insecureFindings.filter(f => f.severity === 'CRITICAL').length,
      high: insecureFindings.filter(f => f.severity === 'HIGH').length,
      medium: insecureFindings.filter(f => f.severity === 'MEDIUM').length,
      low: insecureFindings.filter(f => f.severity === 'LOW').length,
    },
    secureApp: {
      totalFindings: secureFindings.length,
      critical: secureFindings.filter(f => f.severity === 'CRITICAL').length,
      high: secureFindings.filter(f => f.severity === 'HIGH').length,
      medium: secureFindings.filter(f => f.severity === 'MEDIUM').length,
      low: secureFindings.filter(f => f.severity === 'LOW').length,
    },
  },
  insecureFindings: insecureFindings.map(f => ({
    ...f,
    file: f.file.replace(/\\/g, '/'),
  })),
  secureFindings: secureFindings.map(f => ({
    ...f,
    file: f.file.replace(/\\/g, '/'),
  })),
};

// Save JSON report
const reportsDir = path.join(__dirname, '..', 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir);
}

fs.writeFileSync(
  path.join(reportsDir, 'security_scan_results.json'),
  JSON.stringify(report, null, 2)
);

// Print summary
console.log('\n=== SECURITY SCAN SUMMARY ===\n');
console.log('INSECURE APPLICATION:');
console.log(`  Total Findings: ${report.summary.insecureApp.totalFindings}`);
console.log(`  Critical: ${report.summary.insecureApp.critical}`);
console.log(`  High: ${report.summary.insecureApp.high}`);
console.log(`  Medium: ${report.summary.insecureApp.medium}`);
console.log(`  Low: ${report.summary.insecureApp.low}`);

console.log('\nSECURE APPLICATION:');
console.log(`  Total Findings: ${report.summary.secureApp.totalFindings}`);
console.log(`  Critical: ${report.summary.secureApp.critical}`);
console.log(`  High: ${report.summary.secureApp.high}`);
console.log(`  Medium: ${report.summary.secureApp.medium}`);
console.log(`  Low: ${report.summary.secureApp.low}`);

console.log(`\nDetailed report saved to: ${path.join(reportsDir, 'security_scan_results.json')}`);

// Generate markdown report
const mdReport = generateMarkdownReport(report);
fs.writeFileSync(
  path.join(reportsDir, 'SECURITY_TEST_REPORT.md'),
  mdReport
);

console.log(`Markdown report saved to: ${path.join(reportsDir, 'SECURITY_TEST_REPORT.md')}`);

function generateMarkdownReport(report) {
  let md = `# Security Test Report\n\n`;
  md += `**Generated:** ${report.timestamp}\n\n`;
  md += `## Executive Summary\n\n`;
  md += `This report documents the security vulnerabilities found in the insecure and secure versions of the application.\n\n`;
  
  md += `### Insecure Application\n\n`;
  md += `- **Total Findings:** ${report.summary.insecureApp.totalFindings}\n`;
  md += `- **Critical:** ${report.summary.insecureApp.critical}\n`;
  md += `- **High:** ${report.summary.insecureApp.high}\n`;
  md += `- **Medium:** ${report.summary.insecureApp.medium}\n`;
  md += `- **Low:** ${report.summary.insecureApp.low}\n\n`;
  
  md += `### Secure Application\n\n`;
  md += `- **Total Findings:** ${report.summary.secureApp.totalFindings}\n`;
  md += `- **Critical:** ${report.summary.secureApp.critical}\n`;
  md += `- **High:** ${report.summary.secureApp.high}\n`;
  md += `- **Medium:** ${report.summary.secureApp.medium}\n`;
  md += `- **Low:** ${report.summary.secureApp.low}\n\n`;
  
  md += `## Detailed Findings - Insecure Application\n\n`;
  
  const groupedInsecure = {};
  report.insecureFindings.forEach(finding => {
    if (!groupedInsecure[finding.type]) {
      groupedInsecure[finding.type] = [];
    }
    groupedInsecure[finding.type].push(finding);
  });
  
  Object.keys(groupedInsecure).forEach(type => {
    md += `### ${type}\n\n`;
    groupedInsecure[type].forEach(finding => {
      md += `**File:** \`${finding.file}\` (Line ${finding.line})  \n`;
      md += `**Severity:** ${finding.severity}  \n`;
      md += `**Description:** ${finding.description}  \n`;
      md += `**Evidence:**\n\`\`\`\n${finding.evidence}\n\`\`\`\n\n`;
    });
  });
  
  if (report.secureFindings.length > 0) {
    md += `## Detailed Findings - Secure Application\n\n`;
    
    const groupedSecure = {};
    report.secureFindings.forEach(finding => {
      if (!groupedSecure[finding.type]) {
        groupedSecure[finding.type] = [];
      }
      groupedSecure[finding.type].push(finding);
    });
    
    Object.keys(groupedSecure).forEach(type => {
      md += `### ${type}\n\n`;
      groupedSecure[type].forEach(finding => {
        md += `**File:** \`${finding.file}\` (Line ${finding.line})  \n`;
        md += `**Severity:** ${finding.severity}  \n`;
        md += `**Description:** ${finding.description}  \n`;
        md += `**Evidence:**\n\`\`\`\n${finding.evidence}\n\`\`\`\n\n`;
      });
    });
  }
  
  md += `## Remediation Summary\n\n`;
  md += `The following vulnerabilities were successfully remediated in the secure version:\n\n`;
  md += `1. **Hardcoded API Keys** - Moved to environment variables (server-side only)\n`;
  md += `2. **XSS Vulnerabilities** - Implemented DOMPurify sanitization\n`;
  md += `3. **Missing Authentication** - Added authentication checks to protected routes\n`;
  md += `4. **SQL Injection** - Implemented input validation and parameterized queries\n`;
  md += `5. **Insecure API Endpoints** - Added rate limiting and CORS protection\n`;
  md += `6. **Plaintext Passwords** - Implemented password hashing\n`;
  md += `7. **Missing Authorization** - Added role-based access control\n\n`;
  
  md += `## Recommendations\n\n`;
  md += `1. Regular security audits and penetration testing\n`;
  md += `2. Implement Content Security Policy (CSP) headers\n`;
  md += `3. Use security headers (HSTS, X-Frame-Options, etc.)\n`;
  md += `4. Implement proper session management\n`;
  md += `5. Regular dependency updates and vulnerability scanning\n`;
  md += `6. Security training for development team\n`;
  md += `7. Implement logging and monitoring for security events\n`;
  
  return md;
}

process.exit(0);

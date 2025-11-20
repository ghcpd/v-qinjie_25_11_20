const fs = require('fs');
const path = require('path');
const glob = require('glob');

const rules = [
  {
    id: 'HARDCODED_KEY',
    description: 'Hardcoded API key or token in client bundle',
    severity: 'high',
    regex: /(HARDCODED_API_KEY|sk-test-|pk_live_|NEXT_PUBLIC_ANALYTICS_KEY\s*=)/i,
  },
  {
    id: 'CLIENT_DEBUG_LEAK',
    description: 'Leaking secrets to window or console',
    severity: 'high',
    regex: /__DEBUG_CONFIG__|console\.info\("\[DEBUG CONFIG LEAK\]/i,
  },
  {
    id: 'DANGEROUS_HTML',
    description: 'dangerouslySetInnerHTML usage',
    severity: 'high',
    regex: /dangerouslySetInnerHTML/,
  },
  {
    id: 'INSECURE_FETCH',
    description: 'Insecure fetch over http or token in query string',
    severity: 'medium',
    regex: /fetch\([^)]*http:\/\/|token=\$?\{/i,
  },
  {
    id: 'UNAUTH_ADMIN',
    description: 'Admin access controlled by client hint (e.g., query param)',
    severity: 'high',
    regex: /admin"?\)?\s*===\s*"true"|SECRET_ADMIN_FLAG/i,
  },
  {
    id: 'ENV_LEAK',
    description: 'Server env leak to client/UI',
    severity: 'high',
    regex: /process\.env\./i,
    applies: ({ content }) => /"use client"|"use\s+client"/.test(content),
  }
];

async function scanDir(dir) {
  const files = glob.sync(`${dir}/**/*.{js,jsx,ts,tsx}`, {
    nodir: true,
    ignore: ['**/node_modules/**', '**/.next/**'],
  });
  const findings = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    for (const rule of rules) {
      if (rule.regex.test(content)) {
        if (typeof rule.applies === 'function' && !rule.applies({ file, content })) {
          continue;
        }
        findings.push({
          ruleId: rule.id,
          description: rule.description,
          severity: rule.severity,
          file: path.relative(process.cwd(), file),
        });
      }
    }
  }
  return findings;
}

async function main() {
  const insecureFindings = await scanDir('insecure');
  const secureFindings = await scanDir('secure');

  const summary = {
    generatedAt: new Date().toISOString(),
    insecure: {
      findings: insecureFindings,
      passed: insecureFindings.length === 0,
    },
    secure: {
      findings: secureFindings,
      passed: secureFindings.length === 0,
    },
  };

  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(reportsDir, 'security_scan_results.json'), JSON.stringify(summary, null, 2));

  if (require.main === module) {
    // Fail if secure has findings
    if (secureFindings.length > 0) {
      console.error('[SECURITY SCAN] Secure project has findings', secureFindings);
      process.exit(1);
    }
    console.log('[SECURITY SCAN] Complete. Insecure findings:', insecureFindings.length, 'Secure findings:', secureFindings.length);
  }
}

if (require.main === module) {
  main();
}

module.exports = { scanDir, rules };

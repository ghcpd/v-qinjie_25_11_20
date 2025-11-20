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

function validate(dir) {
  const files = readFiles(dir).filter(f => f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.ts') || f.endsWith('.tsx'));
  const issues = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('HARD_CODED_API_KEY') || content.includes('ADM_SECRET') || content.includes('.innerHTML') || content.match(/dangerouslySetInnerHTML/i)) {
      issues.push({ file, issue: 'Insecure pattern present' });
    }
  }
  return issues;
}

const secureDir = path.join(process.cwd(), 'secure');
const issues = validate(secureDir);
if (issues.length > 0) {
  console.error('Security validation failed: insecure patterns detected in secure app');
  console.error(issues);
  process.exit(1);
}
console.log('Secure app validated: no known insecure patterns found');

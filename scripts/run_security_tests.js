const fs = require('fs')
const path = require('path')

const repoRoot = path.resolve(__dirname, '..')
const targets = [ 'insecure', 'secure' ]

const patterns = [
  {id:'hardcoded-key', re:/HARD_CODED|HARD-CODED|HARD_CODED_API_KEY|TOP-SECRET|SECRET-API|SECRET/g, severity:'high', description:'Hard-coded keys or secrets in source.'},
  {id:'client-leak', re:/window\.__CLIENT_KEY__|NEXT_PUBLIC_/, severity:'high', description:'Secrets exposed to window or public env var.'},
  {id:'xss-danger', re:/dangerouslySetInnerHTML|innerHTML/g, severity:'high', description:'Dangerous HTML insertion without sanitization.'},
  {id:'http-fetch', re:/fetch\(['\"]http:\/\//g, severity:'medium', description:'Insecure HTTP fetch request detected.'},
  {id:'debug-logs', re:/console\.log\(|console\.debug\(|alert\(/g, severity:'low', description:'Debug logs or alerts that leak info to UI.'},
  {id:'open-admin', re:/pages\/admin|Admin Console/g, severity:'medium', description:'Admin route present; verify access control.'}
]

const results = []

targets.forEach(target=>{
  const dir = path.join(repoRoot, target)
  if(!fs.existsSync(dir)) return
  scanDir(dir, target)
})

function scanDir(dir,target){
  const entries = fs.readdirSync(dir)
  entries.forEach(entry=>{
    const p = path.join(dir, entry)
    const stat = fs.statSync(p)
    if(stat.isDirectory()) return scanDir(p,target)
    const content = fs.readFileSync(p,'utf8')
    patterns.forEach(pat=>{
      if(pat.re.test(content)){
        results.push({target, file: path.relative(repoRoot,p), pattern: pat.id, severity: pat.severity, description: pat.description})
      }
    })
  })
}

const outPath = path.join(__dirname, '..','reports','security_scan_results.json')
fs.mkdirSync(path.dirname(outPath), {recursive:true})
fs.writeFileSync(outPath, JSON.stringify({generated:new Date().toISOString(), findings:results}, null, 2))
console.log('Scan written to', outPath)

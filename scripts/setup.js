const { spawnSync } = require('child_process');
const path = require('path');

function run(cmd, args, cwd) {
  const opts = { cwd, stdio: 'inherit', shell: true };
  const r = spawnSync(cmd, args, opts);
  if (r.status !== 0) process.exit(r.status);
}

console.log('Installing root dependencies...');
run('npm', ['install'], process.cwd());

console.log('Installing insecure dependencies...');
run('npm', ['install'], path.join(process.cwd(), 'insecure'));

console.log('Installing secure dependencies...');
run('npm', ['install'], path.join(process.cwd(), 'secure'));

console.log('Running initial scan...');
run('node', [path.join('scripts', 'scan.js')], process.cwd());

console.log('Setup complete. To run the secure app: npm run dev:secure');

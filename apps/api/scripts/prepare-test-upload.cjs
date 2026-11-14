const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../../..');
const output = path.join(root, 'dist/backend-test-source');
fs.mkdirSync(path.join(output, 'apps/api'), { recursive: true });
for (const name of ['package-lock.json', 'tsconfig.json', 'railway.json']) {
  fs.copyFileSync(path.join(root, name), path.join(output, name));
}
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
// Railpack's default commands must build and start only this backend.
pkg.scripts.build = pkg.scripts['build:api'];
pkg.scripts.start = pkg.scripts['start:api:production'];
fs.writeFileSync(path.join(output, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
for (const name of ['src', 'scripts', 'database', 'tsconfig.json']) {
  fs.cpSync(path.join(root, 'apps/api', name), path.join(output, 'apps/api', name), { recursive: true });
}
// Refuse an upload directory that someone has accidentally populated with secrets.
for (const file of fs.readdirSync(output, { recursive: true })) {
  if (/^\.env(?:\.|$)/.test(path.basename(file))) {
    throw new Error('Remove environment files from the upload directory before deploying');
  }
}
console.log('Prepared backend source at dist/backend-test-source (no local environment or uploads copied).');

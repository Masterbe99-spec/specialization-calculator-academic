// Documentation consistency check. Run from the project root:
//   node tests/docs-check.js            (errors fail, missing tests are warnings)
//   node tests/docs-check.js --require-tests   (missing tests are errors too)
//   node tests/docs-check.js --print-hashes     print the two hashes that evidence/screenshots/README.md must contain
// Uses only Node's built-in modules. It reads files; it never changes them.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const requireTests = process.argv.includes('--require-tests');
// Screenshots are only evidence if they show the CURRENT application. evidence/screenshots/README.md records a hash of the
// application files (and of the static prototype); this check fails when a file has changed since the screenshots were taken.
const APP_FILES = ['src/index.html', 'src/css/styles.css', 'src/js/engine.js', 'src/js/format.js', 'src/js/keymap.js', 'src/js/app.js'];
function hashOf(files) {
  const h = crypto.createHash('sha256');
  for (const f of files) h.update(f + '\n' + fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n') + '\n');
  return h.digest('hex');
}
if (process.argv.includes('--print-hashes')) {
  console.log('APP-SOURCE-HASH: ' + hashOf(APP_FILES));
  console.log('PROTOTYPE-HASH: ' + hashOf(['docs/03-design-prototype/visual-prototype.html']));
  process.exit(0);
}
const errors = [];
const warnings = [];
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

function walk(dir, ext, out = []) {
  for (const name of fs.readdirSync(path.join(root, dir))) {
    const rel = path.join(dir, name);
    const full = path.join(root, rel);
    if (name === 'node_modules' || name === '.git') continue;
    if (fs.statSync(full).isDirectory()) walk(rel, ext, out);
    else if (name.endsWith(ext)) out.push(rel);
  }
  return out;
}

// 1. Relative Markdown links must point to files that exist.
const mdFiles = ['README.md', ...walk('docs', '.md')];
let linkCount = 0;
for (const f of mdFiles) {
  const text = read(f).replace(/```[\s\S]*?```/g, '');
  for (const m of text.matchAll(/\]\(([^)\s#]+)(#[^)]*)?\)/g)) {
    const target = m[1];
    if (/^(https?:|mailto:)/.test(target)) continue;
    linkCount++;
    if (!fs.existsSync(path.resolve(root, path.dirname(f), target))) errors.push(`Broken link in ${f}: ${target}`);
  }
}

// 2. Requirements in the specification and the traceability matrix must agree.
const spec = read('docs/02-research-requirements/requirements-specification.md');
const trace = read('docs/02-research-requirements/traceability-matrix.md');
const specRows = [...spec.matchAll(/^\| ((?:N?FR)-\d\d) \|(.*)$/gm)];
const ids = specRows.map((m) => m[1]);
const priority = {};
for (const m of specRows) {
  if (m[1].startsWith('FR')) priority[m[1]] = m[2].split('|').map((s) => s.trim()).filter(Boolean)[1];
}
const partB = trace.slice(trace.indexOf('## Part B'), trace.indexOf('## Part C'));
for (const id of ids) {
  if (!new RegExp(`^\\| ${id} \\|`, 'm').test(partB)) errors.push(`${id} is in the specification but not in traceability Part B`);
}
for (const m of partB.matchAll(/^\| ((?:N?FR)-\d\d) \|/gm)) {
  if (!ids.includes(m[1])) errors.push(`${m[1]} is in traceability Part B but not in the specification`);
}

// 3. Counts in traceability Part C must match the specification.
const frIds = ids.filter((i) => i.startsWith('FR'));
const nfrIds = ids.filter((i) => i.startsWith('NFR'));
const count = (p) => frIds.filter((i) => priority[i] === p).length;
const partC = trace.slice(trace.indexOf('## Part C'));
const expect = `${frIds.length} IDs: ${count('M')} Must, ${count('S')} Should, ${count('C')} Could, ${count('W')} retired`;
if (!partC.includes(expect)) errors.push(`Traceability Part C should say "${expect}"`);
const active = frIds.length - count('W');
if (!partC.includes(`${active + nfrIds.length} of ${active + nfrIds.length}`)) errors.push(`Traceability Part C should say "${active + nfrIds.length} of ${active + nfrIds.length}" planned verifications`);

// 4. Every active functional requirement should have a test whose name contains its test ID.
const testFiles = fs.existsSync(path.join(root, 'tests')) ? walk('tests', '.test.js') : [];
const testText = testFiles.map(read).join('\n');
let covered = 0;
for (const id of frIds) {
  if (priority[id] === 'C') continue; // Could have: only if built
  const tid = 'T-' + id;
  if (testText.includes(tid)) covered++;
  else (requireTests ? errors : warnings).push(`No automated test mentions ${tid}`);
}

// 5. Planning figures that must agree between documents.
const card = read('docs/01-project-card/project-card.md');
const wbs = read('docs/01-project-card/wbs.md');
if (card.includes('198') !== wbs.includes('198')) errors.push('Effort figure 198 appears in only one of project-card.md and wbs.md');
for (const f of ['README.md', 'docs/01-project-card/project-card.md']) {
  if (!read(f).includes('18 December 2026')) errors.push(`${f} does not mention the deadline 18 December 2026`);
}

// 5b. The screenshots must match the current application and prototype.
const shotsReadme = read('evidence/screenshots/README.md');
for (const [label, files] of [['APP-SOURCE-HASH', APP_FILES], ['PROTOTYPE-HASH', ['docs/03-design-prototype/visual-prototype.html']]]) {
  const m = shotsReadme.match(new RegExp(label + ': ([0-9a-f]{64})'));
  if (!m) errors.push(`evidence/screenshots/README.md has no "${label}: <sha256>" line`);
  else if (m[1] !== hashOf(files)) errors.push(`${label} does not match the current files: the screenshots may be out of date. Retake them (node tests/browser-check.js --shots, --firefox --shots) and run node tests/docs-check.js --print-hashes`);
}
const shotFiles = fs.readdirSync(path.join(root, 'evidence', 'screenshots')).filter((f) => f.endsWith('.png'));
for (const f of shotFiles) if (!shotsReadme.includes(f)) errors.push(`evidence/screenshots/README.md does not describe ${f}`);

// 6. Every document should state when it was last updated.
for (const f of mdFiles.filter((x) => x.startsWith('docs'))) {
  if (/\.gitkeep$/.test(f)) continue;
  if (!/\*\*Last updated:?\*\*/.test(read(f))) warnings.push(`${f} has no "Last updated" line`);
}

console.log(`Checked ${mdFiles.length} Markdown files, ${linkCount} relative links, ${ids.length} requirement IDs, ${testFiles.length} test files (${covered} FR with a test).`);
for (const w of warnings) console.log('WARNING: ' + w);
for (const e of errors) console.log('ERROR: ' + e);
console.log(errors.length ? `FAILED: ${errors.length} error(s), ${warnings.length} warning(s)` : `PASSED: 0 errors, ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);

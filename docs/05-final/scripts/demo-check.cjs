const path = require('path'); const { pathToFileURL } = require('url');
const root = process.argv[2];
const { startChromium } = require(path.join(root, 'tests', 'browser-backends.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const exe = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
  const b = await startChromium(exe, pathToFileURL(path.join(root, 'src', 'index.html')).href);
  const ev = b.evalJs; let bad = 0, n = 0;
  const txt = (id) => ev(`document.getElementById('${id}').textContent`);
  async function click(k) { const p = await ev(`(() => { const e = document.querySelector('[data-key="${k}"]'); e.scrollIntoView({block:'center'}); const r = e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; })()`); await b.mouseClick(p.x, p.y); }
  const N = { c: 'CLEAR', b: 'BACKSPACE', n: 'NEGATE' };
  const clicks = async (s) => { for (const ch of s) await click(N[ch] || ch); };
  const type = async (s) => { for (const ch of s) await b.pressKey(ch === '\n' ? 'Enter' : ch); };
  const expect = async (label, want, wantMsg) => {
    n++; const got = await txt('display'); const msg = await txt('error');
    const ok = got === want && (wantMsg === undefined || msg === wantMsg); if (!ok) bad++;
    console.log((ok ? 'OK   ' : 'FAIL ') + label.padEnd(46) + 'display "' + got + '"' + (msg ? ' message "' + msg + '"' : '') + (ok ? '' : '   WANTED "' + want + '"' + (wantMsg !== undefined ? ' / "' + wantMsg + '"' : '')));
  };
  try {
    await b.setViewport(1000, 800, 1); await b.reload(); await sleep(800);
    console.log('--- the demo script, in order, one page load, state kept between steps ---');
    await expect('step 1  open page', '0');
    await clicks('7+8='); await expect('step 2  click 7 + 8 =', '15');
    await clicks('2+3*4='); await expect('step 3  click 2 + 3 x 4 =', '20');
    await type('0.1+0.2='); await expect('step 4  type 0.1 + 0.2 =', '0.3');
    await clicks('5/0='); await expect('step 5a click 5 / 0 =', 'Error', 'Cannot divide by zero');
    await clicks('7'); await expect('step 5b click 7 (recovery)', '7', '');
    await b.pressKey('Escape'); await expect('step 6a press Esc', '0');
    await type('12+30*2\n'); await expect('step 6b type 12+30*2 Enter', '84');
    await clicks('c'); await expect('step 7a click C', '0');
    await clicks('12'); await expect('step 7b click 1, 2', '12');
    await clicks('n'); await expect('step 7c click sign key', '-12');
    await clicks('b'); await expect('step 7d click delete key', '-1');
    await clicks('c'); await clicks('0.1+0.2-0.3='); await expect('optional  0.1 + 0.2 - 0.3 =', '5.55111512313e-17');
    await clicks('c'); await expect('reset for step 8', '0');
    for (const w of [320, 360]) {
      await b.setViewport(w, 640, 1); await sleep(300); n++;
      const r = await ev(`(() => { const ks=[...document.querySelectorAll('[data-key]')]; const vw=document.documentElement.clientWidth; const out=ks.filter(k=>{const r=k.getBoundingClientRect(); return r.left<0||r.right>vw+0.5}).length; return {keys:ks.length,out,scrollW:document.documentElement.scrollWidth,vw}; })()`);
      const ok = r.keys === 19 && r.out === 0 && r.scrollW <= r.vw; if (!ok) bad++;
      console.log((ok ? 'OK   ' : 'FAIL ') + `step 8  narrow window ${w}px`.padEnd(46) + JSON.stringify(r));
    }
    await b.setViewport(1000, 800, 1); await sleep(200);
    console.log('--- why step 7 starts with C: after a result the sign and delete keys behave differently ---');
    await clicks('c'); await type('12+30*2\n'); await clicks('n'); await expect('after 84: sign key', '-84'); await clicks('b'); await expect('after 84: delete key (no effect on result)', '-84');
    console.log('console problems:', JSON.stringify(b.problems));
    console.log(bad ? `FAILURES ${bad} of ${n}` : `ALL ${n} CHECKS PASS`); if (bad || b.problems.length) process.exitCode = 1;
  } finally { await b.close(); }
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });

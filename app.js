/* ===== DAY 30 — 4-week calisthenics tracker ===== */
(() => {
'use strict';

/* ---------- utilities ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');
const fmtDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseDate = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parseDate(s); d.setDate(d.getDate() + n); return fmtDate(d); };
const todayStr = () => fmtDate(new Date());
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WDL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const niceDate = s => { const d = parseDate(s); return `${WDL[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}`; };
const shortDate = s => { const d = parseDate(s); return `${d.getDate()} ${MON[d.getMonth()]}`; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mondayOf = s => { const d = parseDate(s); const wd = d.getDay(); d.setDate(d.getDate() - ((wd + 6) % 7)); return fmtDate(d); };
const mmss = sec => `${Math.floor(sec / 60)}:${pad(Math.max(0, Math.ceil(sec % 60)) % 60)}`;

/* ---------- state ---------- */
const KEY = 'day30-state-v1';
const DEFAULT = () => ({
  startMonday: mondayOf(todayStr()), pushupLevel: 'wall_pushup', autoRest: true, sound: true,
  logs: {}, weights: [], waist: [], installDismissed: false
});
let S = DEFAULT();
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(DEFAULT(), JSON.parse(raw)); } catch (e) { /* ignore */ }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Could not save (storage blocked)'); } };
const log = d => (S.logs[d] ||= { sets: {}, reps: {}, warm: [], cardioDone: false, cardioMin: 0, pain: null, steps: null, notes: '', complete: false });

/* ---------- program calendar ---------- */
function dayInfo(dateStr) {
  const idx = Math.round((parseDate(dateStr) - parseDate(S.startMonday)) / 86400000);
  const week = Math.floor(idx / 7) + 1, wd = parseDate(dateStr).getDay();
  const inProgram = idx >= 0 && idx < PLAN.weeks * 7;
  const type = PLAN.dayTypes[wd];
  let workout = null;
  if (type === 'strength') workout = (week % 2 === 1 ? PLAN.strengthPattern.odd : PLAN.strengthPattern.even)[wd];
  const title = type === 'strength' ? `Workout ${workout} · Full body` : type === 'cardio' ? 'Cardio + Shoulder routine'
    : type === 'easy' ? 'Easy cardio + Shoulder routine' : 'Rest day';
  const code = type === 'strength' ? workout : type === 'cardio' ? 'C' : type === 'easy' ? 'E' : 'R';
  return { idx, week, wd, inProgram, type, workout, title, code, dayNum: idx + 1, cardioMin: PLAN.cardioMinutes[wd] || 0 };
}
const weekFrac = w => PLAN.weekFraction[Math.min(Math.max(w, 1), 4) - 1];
function targetReps(ex, week) { const [lo, hi] = ex.reps; return Math.round(lo + (hi - lo) * weekFrac(week)); }
function exList(info) {
  if (info.type === 'strength') return PLAN[info.workout].map(id => id === 'wall_pushup' ? S.pushupLevel : id);
  if (info.type === 'cardio' || info.type === 'easy') return PLAN.shoulder;
  return [];
}
function dayProgress(dateStr) {
  const info = dayInfo(dateStr), L = S.logs[dateStr];
  let total = 0, done = 0;
  if (info.type === 'strength') {
    total += PLAN.warmup.length; done += (L?.warm || []).filter(Boolean).length;
    exList(info).forEach(id => { total += EX[id].sets; done += (L?.sets?.[id] || []).filter(Boolean).length; });
  } else if (info.type === 'cardio' || info.type === 'easy') {
    exList(info).forEach(id => { total += EX[id].sets; done += (L?.sets?.[id] || []).filter(Boolean).length; });
    total += 1; done += L?.cardioDone ? 1 : 0;
  } else { total = 1; done = L?.complete ? 1 : 0; }
  return { total, done, pct: total ? Math.round(done / total * 100) : 0, complete: !!L?.complete };
}

/* ---------- stick figure ---------- */
const POSE0 = { x: 0, y: 0, rot: 0, torso: 0, uL: 0, uR: null, fL: 0, fR: null, tL: 0, tR: null, sL: 0, sR: null };
function normPose(p) {
  const o = Object.assign({}, POSE0, p);
  if (o.uR == null) o.uR = o.uL; if (o.fR == null) o.fR = o.fL; if (o.tR == null) o.tR = o.tL; if (o.sR == null) o.sR = o.sL;
  return o;
}
const piv = (px, py, deg) => `translate(${px}px,${py}px) rotate(${deg}deg) translate(${-px}px,${-py}px)`;
const partTransforms = p => ({
  body: `translate(${p.x}px,${p.y}px) rotate(${p.rot}deg)`,
  torso: `rotate(${p.torso}deg)`,
  uL: piv(0, -40, p.uL), uR: piv(0, -40, p.uR), fL: piv(0, -12, p.fL), fR: piv(0, -12, p.fR),
  tL: `rotate(${p.tL}deg)`, tR: `rotate(${p.tR}deg)`, sL: piv(0, 35, p.sL), sR: piv(0, 35, p.sR)
});
function propSVG(props) {
  let out = '';
  (props || []).forEach(pr => {
    const [k, v] = pr.split(':'); const n = v != null ? Number(v) : null;
    if (k === 'wall-front') { const x = n ?? 64; out += `<line class="prop" x1="${x}" y1="-84" x2="${x}" y2="70"/>`; }
    else if (k === 'wall-near') { const x = n ?? 57; out += `<line class="prop" x1="${x}" y1="-84" x2="${x}" y2="70"/>`; }
    else if (k === 'wall') { out += `<line class="prop" x1="${n}" y1="-84" x2="${n}" y2="70"/>`; }
    else if (k === 'wall-back') out += `<line class="prop" x1="-9" y1="-84" x2="-9" y2="70"/>`;
    else if (k === 'wall-side') out += `<line class="prop" x1="31" y1="-44" x2="31" y2="14"/><line class="prop" x1="31" y1="-30" x2="40" y2="-36"/><line class="prop" x1="31" y1="-16" x2="40" y2="-22"/><line class="prop" x1="31" y1="-2" x2="40" y2="-8"/>`;
    else if (k === 'chair-front') out += `<polyline class="prop" points="58,70 58,-12 92,-12 92,70"/>`;
    else if (k === 'chair-back') out += `<polyline class="prop" points="-24,70 -24,40 -58,40 -58,70"/><line class="prop" x1="-58" y1="40" x2="-58" y2="-8"/>`;
    else if (k === 'counter') out += `<polyline class="prop" points="72,70 72,13 100,13"/>`;
    else if (k === 'table') out += `<polyline class="prop" points="80,70 80,38 100,38"/>`;
  });
  return out;
}
function figureSVG(anim) {
  const p = normPose(anim.poses[0]); const t = partTransforms(p);
  const foot = anim.noFoot ? '' : '<line x1="0" y1="70" x2="10" y2="70"/>';
  const leg = side => `<g data-part="t${side}" style="transform:${t['t' + side]}"><line x1="0" y1="0" x2="0" y2="35"/><g data-part="s${side}" style="transform:${t['s' + side]}"><line x1="0" y1="35" x2="0" y2="70"/>${foot}</g></g>`;
  const arm = side => `<g data-part="u${side}" style="transform:${t['u' + side]}"><line x1="0" y1="-40" x2="0" y2="-12"/><g data-part="f${side}" style="transform:${t['f' + side]}"><line x1="0" y1="-12" x2="0" y2="12"/></g></g>`;
  const wide = anim.floor || (anim.props && anim.props.length);
  return `<svg class="fig-svg" viewBox="${wide ? '-100 -88 200 168' : '-64 -88 128 168'}" xmlns="http://www.w3.org/2000/svg">
    <line class="floor" x1="-100" y1="70" x2="100" y2="70"/>${propSVG(anim.props)}
    <g data-part="body" style="transform:${t.body}">
      <g class="back">${leg('R')}</g>
      <g data-part="torso" style="transform:${t.torso}">
        <g class="back">${arm('R')}</g>
        <line x1="0" y1="0" x2="0" y2="-40"/><circle class="head" cx="0" cy="-53" r="8.5"/>
        ${arm('L')}
      </g>
      ${leg('L')}
    </g></svg>`;
}
const figObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(e => (e.target._anims || []).forEach(a => e.isIntersecting ? a.play() : a.pause()));
}, { rootMargin: '80px' }) : null;
function animateFigures(root) {
  $$('.fig-svg[data-anim]', root).forEach(svg => {
    const anim = EX[svg.dataset.anim]?.anim; if (!anim || svg._anims) return;
    const frames = anim.poses.map(p => partTransforms(normPose(p)));
    const opts = { duration: anim.dur, iterations: Infinity, easing: 'ease-in-out', direction: frames.length === 2 ? 'alternate' : 'normal' };
    svg._anims = $$('[data-part]', svg).map(el => {
      const key = el.dataset.part; const kf = frames.map(f => ({ transform: f[key] }));
      if (frames.length > 2) kf.push({ transform: frames[0][key] });
      return el.animate(kf, opts);
    });
    if (figObserver) figObserver.observe(svg);
  });
}
const fig = id => `<div data-fig>${figureSVG(EX[id].anim).replace('<svg ', `<svg data-anim="${id}" `)}</div>`;

/* ---------- toast ---------- */
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2200); }

/* ---------- audio / haptics ---------- */
let actx;
function beep(freq = 880, ms = 140, n = 1) {
  if (!S.sound) return;
  try {
    actx ||= new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < n; i++) {
      const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.value = freq;
      const t0 = actx.currentTime + i * (ms / 1000 + 0.08);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.4, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + ms / 1000);
      o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + ms / 1000 + 0.02);
    }
  } catch (e) { /* ignore */ }
  if (navigator.vibrate) navigator.vibrate(n === 1 ? 60 : [80, 60, 80, 60, 200]);
}

/* ---------- timer ---------- */
const Timer = {
  steps: [], i: 0, remain: 0, last: 0, running: false, raf: null, onDone: null, mode: 'rest',
  open(steps, { onDone, label } = {}) {
    this.steps = steps; this.i = 0; this.onDone = onDone; this.label = label;
    try { actx ||= new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { /* ignore */ }
    $('#timer').hidden = false; this.startStep(); this.running = false; this.toggle();
  },
  startStep() {
    const st = this.steps[this.i]; this.remain = st.sec; this.total = st.sec; this.warned = false;
    $('#timer-label').textContent = st.label || this.label || ''; $('#timer-sub').textContent = st.sub || '';
    const f = $('#timer-figure'); f.innerHTML = st.ex ? fig(st.ex) : ''; animateFigures(f);
    $('#ring-fg').classList.toggle('work', !!st.work);
    this.draw();
  },
  draw() {
    $('#timer-time').textContent = mmss(this.remain);
    $('#ring-fg').style.strokeDashoffset = 326.7 * (1 - Math.max(0, this.remain) / this.total);
  },
  tick: null,
  toggle() {
    this.running = !this.running; $('#timer-toggle').textContent = this.running ? 'Pause' : 'Resume';
    clearInterval(this.tick);
    if (this.running) { this.last = performance.now(); this.tick = setInterval(() => this.step(), 200); }
  },
  step() {
    const now = performance.now(); this.remain -= (now - this.last) / 1000; this.last = now;
    if (this.remain <= 3 && this.remain > 0 && !this.warned) { this.warned = true; beep(660, 80); }
    if (this.remain <= 0) { this.next(true); return; }
    this.draw();
  },
  next(auto) {
    if (this.i < this.steps.length - 1) { this.i++; beep(880, 120, 1); this.startStep(); }
    else { this.finish(auto); }
  },
  adjust(d) { this.remain = Math.max(0, this.remain + d); this.total = Math.max(this.total, this.remain); this.draw(); },
  finish(auto) { clearInterval(this.tick); this.running = false; $('#timer').hidden = true; if (auto) beep(1046, 160, 3); if (this.onDone) this.onDone(auto); },
  close() { clearInterval(this.tick); this.running = false; $('#timer').hidden = true; }
};
$('#timer-close').onclick = () => Timer.close();
$('#timer-toggle').onclick = () => Timer.toggle();
$('#timer-skip').onclick = () => Timer.next(false);
$('#timer-minus').onclick = () => Timer.adjust(-15);
$('#timer-plus').onclick = () => Timer.adjust(15);

/* ---------- views ---------- */
const qs = new URLSearchParams(location.search);
let tab = ['today', 'plan', 'exercises', 'progress'].includes(qs.get('tab')) ? qs.get('tab') : 'today', viewDate = qs.get('date') || todayStr(), libFilter = qs.get('filter') || 'All';
const view = $('#view');

function render() {
  $$('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  const info = dayInfo(todayStr());
  $('#topbar-right').textContent = info.inProgram ? `Week ${info.week} · Day ${info.dayNum} of 28` : info.idx < 0 ? `Starts ${shortDate(S.startMonday)}` : 'Program complete';
  view.innerHTML = { today: renderToday, plan: renderPlan, exercises: renderLibrary, progress: renderProgress }[tab]();
  animateFigures(view);
  bind();
  window.scrollTo({ top: 0 });
}

/* ----- TODAY ----- */
function ringSVG(pct) {
  const r = 26, c = 2 * Math.PI * r;
  return `<div class="ring-wrap"><svg viewBox="0 0 62 62"><circle class="rb" cx="31" cy="31" r="${r}"/><circle class="rf" cx="31" cy="31" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/></svg><div class="pct">${pct}%</div></div>`;
}
function exCard(id, n, info, L) {
  const ex = EX[id]; const done = L.sets[id] || []; const t = targetReps(ex, info.week); const unit = ex.unit || 'reps';
  const allDone = done.filter(Boolean).length >= ex.sets;
  const setBtns = Array.from({ length: ex.sets }, (_, i) => `<button class="set-btn ${done[i] ? 'done' : ''}" data-set="${id}:${i}">Set ${i + 1}<small>${done[i] ? '✓ done' : `${t} ${unit}${ex.perSide ? '/side' : ''}`}</small></button>`).join('');
  const lvl = ex.pushup ? `<select data-pushup class="tiny" style="width:auto;padding:4px 8px;margin-left:6px">${PUSHUP_LEVELS.map(l => `<option value="${l.id}" ${l.id === S.pushupLevel ? 'selected' : ''}>${l.label}</option>`).join('')}</select>` : '';
  return `<div class="ex ${allDone ? 'done' : ''}" data-ex="${id}">
    <div class="ex-head"><div class="ex-fig">${fig(id)}</div>
      <div class="ex-body"><div class="ex-title"><span class="num">${pad(n)}</span>${esc(ex.name)}</div>
        <div class="ex-target"><b>${ex.sets} × ${ex.reps[0]}–${ex.reps[1]} ${unit}</b>${ex.perSide ? ' each side' : ''} · Week ${Math.min(info.week, 4)} target <b>${t}</b>${ex.rest ? ` · Rest ${ex.rest}s` : ''}</div>
        <button class="ex-toggle" data-toggle>How to do it ▾</button>${lvl}</div></div>
    <div class="ex-cues"><ul>${ex.cues.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>
    <div class="sets">${setBtns}</div>
    <div class="ex-foot"><span class="small muted">${unit === 's' ? 'Seconds' : 'Reps'} done / set</span><input type="number" inputmode="numeric" data-reps="${id}" value="${L.reps[id] ?? ''}" placeholder="${t}">${ex.rest ? `<button class="btn small ghost" data-rest="${ex.rest}" data-restname="${esc(ex.name)}">⏱ ${ex.rest}s</button>` : ''}</div>
  </div>`;
}
function checkin(L, info) {
  const p = L.pain ?? 0; const cls = p <= 2 ? 'ok' : p <= 4 ? 'warn' : 'bad';
  return `<div class="section-title">Check-in</div>
  <div class="card"><label class="field">Left shoulder today (0 = nothing, 10 = worst)</label>
    <div class="row"><div class="pain-val ${cls}" id="pain-val">${L.pain ?? '–'}</div><input type="range" min="0" max="10" step="1" value="${p}" data-pain></div>
    <p class="small muted mt">0–2 discomfort that settles quickly = acceptable. Sharp pain, instability, numbness, catching = STOP.</p>
    ${p >= 5 ? '<div class="alert">Pain 5+ logged. Skip pushing movements today. If it is worse over several sessions, see a physio or sports-medicine clinician.</div>' : ''}
  </div>
  <div class="card"><div class="row"><div style="flex:1"><label class="field">Steps today</label><input type="number" inputmode="numeric" data-steps value="${L.steps ?? ''}" placeholder="8,000–10,000"></div>
    ${info.wd === 0 || S.weights.length === 0 ? `<div style="flex:1"><label class="field">Weigh-in (kg)</label><input type="number" inputmode="decimal" step="0.1" data-weight placeholder="77.0"></div>` : ''}</div>
    <label class="field mt">Notes</label><textarea data-notes placeholder="How it felt, what to change next time…">${esc(L.notes || '')}</textarea></div>`;
}
function renderToday() {
  const info = dayInfo(viewDate); const L = log(viewDate); const pr = dayProgress(viewDate);
  const isToday = viewDate === todayStr();
  let html = `<div class="day-nav"><button data-nav="-1">‹</button><div class="center"><h1>${isToday ? 'Today' : niceDate(viewDate).split(',')[0]}</h1><div class="muted">${niceDate(viewDate)}${isToday ? '' : ' · <a href="#" data-nav="0" style="color:var(--blue)">back to today</a>'}</div></div><button data-nav="1">›</button></div>`;
  if (!info.inProgram) {
    html += `<div class="hero"><span class="badge">${info.idx < 0 ? 'Before start' : 'After week 4'}</span><h2>${info.idx < 0 ? 'Program starts ' + shortDate(S.startMonday) : 'Month 1 done'}</h2>
      <p class="muted">${info.idx < 0 ? 'Change the start date in the Plan tab if you want to begin this week.' : 'You finished the 4 weeks. Check Progress for the summary, then get a resistance band for month 2: rows, pulldowns, face pulls.'}</p></div>`;
    return html + checkin(L, info);
  }
  html += `<div class="hero">${ringSVG(pr.pct)}<div class="row"><span class="badge ${info.code === 'A' || info.code === 'B' ? info.code : info.type}">${info.code === 'A' || info.code === 'B' ? 'Workout ' + info.code : info.type.toUpperCase()}</span><span class="badge">Week ${info.week} · Day ${info.dayNum}</span>${pr.complete ? '<span class="badge done">✓ Complete</span>' : ''}</div>
    <h2>${info.title}</h2><p class="muted small">${info.type === 'strength' ? 'Warm-up 7–8 min · 8 exercises · ~35 min' : info.type === 'cardio' ? `Shoulder routine 8–10 min · Cardio ${info.cardioMin} min` : info.type === 'easy' ? `Shoulder routine 8–10 min · Easy cardio ${info.cardioMin} min` : 'Recover. Walk, eat protein, sleep 7–9 h.'}</p>
    <div class="week-note"><b>Week ${Math.min(info.week, 4)}:</b> ${PLAN.weekNotes[Math.min(info.week, 4) - 1]}</div></div>`;

  if (info.type === 'strength') {
    html += `<div class="section-title"><span>Warm-up · 7–8 min</span><span>${(L.warm || []).filter(Boolean).length}/${PLAN.warmup.length}</span></div><div class="check-list">`;
    PLAN.warmup.forEach((id, i) => { const on = L.warm?.[i]; html += `<div class="item ${on ? 'on' : ''}" data-warm="${i}"><div class="fig">${fig(id)}</div><div class="t"><b>${esc(EX[id].name)}</b><span>${esc(EX[id].dose)}</span></div><div class="check ${on ? 'on' : ''}">${on ? '✓' : ''}</div></div>`; });
    html += `</div><div class="section-title"><span>Workout ${info.workout}</span><span>${pr.done}/${pr.total}</span></div>`;
    exList(info).forEach((id, i) => html += exCard(id, i + 1, info, L));
  } else if (info.type === 'cardio' || info.type === 'easy') {
    html += `<div class="section-title"><span>Left shoulder routine · 8–10 min</span></div>`;
    exList(info).forEach((id, i) => html += exCard(id, i + 1, info, L));
    const mins = L.cardioMin || info.cardioMin;
    html += `<div class="section-title"><span>Indoor cardio · ${info.type === 'easy' ? 'easy / moderate' : 'moderate'}</span></div>
    <div class="card"><p class="small muted">Repeat this circuit continuously. Breathing harder but still able to speak a short sentence. No jumping.</p>
      <div class="circuit">${PLAN.cardioCircuit.map(c => `<div class="step"><div class="fig">${fig(c.id)}</div><b>${esc(EX[c.id].name)}</b><span>${c.sec / 60} min</span></div>`).join('')}</div>
      <div class="chips" data-mins>${[25, 30, 35, 40].map(m => `<button class="chip ${m === mins ? 'on' : ''}" data-min="${m}">${m} min</button>`).join('')}</div>
      <div class="row mt"><button class="btn primary block" data-circuit>▶ Start ${mins}-min circuit timer</button></div>
      <div class="row mt"><button class="btn block ${L.cardioDone ? 'green' : ''}" data-cardio-done>${L.cardioDone ? `✓ Cardio done · ${L.cardioMin} min` : 'Mark cardio done'}</button></div>
    </div>`;
  } else {
    html += `<div class="card"><b>Rest day rules</b><ul class="list-plain mt"><li>Walk. 8,000–10,000 steps still counts.</li><li>Sunday = weigh-in day. Morning, after the toilet, before food.</li><li>Sore? That is normal in week 1. Sharp shoulder pain is not.</li><li>Cook for the week: dal, chicken, paneer, curd. Measure the oil.</li></ul></div>`;
  }
  html += checkin(L, info);
  html += `<button class="btn block ${pr.complete ? 'green' : 'primary'}" data-complete style="margin-top:6px">${pr.complete ? '✓ Day complete · tap to undo' : pr.pct === 100 || info.type === 'rest' ? 'Mark day complete' : `Mark day complete (${pr.pct}% done)`}</button>`;
  return html;
}

/* ----- PLAN ----- */
function renderPlan() {
  const today = todayStr();
  let html = `<div class="card"><div class="row between"><b>Program start (Monday)</b><input type="date" data-start value="${S.startMonday}" style="width:auto"></div>
    <div class="row between mt"><b>Push-up level</b><select data-pushup style="width:auto">${PUSHUP_LEVELS.map(l => `<option value="${l.id}" ${l.id === S.pushupLevel ? 'selected' : ''}>${l.label}</option>`).join('')}</select></div>
    <div class="row between mt"><b>Auto rest timer after a set</b><button class="chip ${S.autoRest ? 'on' : ''}" data-autorest>${S.autoRest ? 'On' : 'Off'}</button></div>
    <div class="row between mt"><b>Timer sounds</b><button class="chip ${S.sound ? 'on' : ''}" data-sound>${S.sound ? 'On' : 'Off'}</button></div></div>
    <div class="legend"><span><i style="background:var(--accent-2)"></i>A</span><span><i style="background:var(--blue)"></i>B</span><span><i style="background:var(--green)"></i>Cardio + shoulder</span><span><i style="background:var(--yellow)"></i>Easy cardio</span><span><i style="background:var(--muted)"></i>Rest</span></div>`;
  for (let w = 1; w <= PLAN.weeks; w++) {
    const first = addDays(S.startMonday, (w - 1) * 7);
    let doneCount = 0; let cells = '';
    for (let d = 0; d < 7; d++) {
      const ds = addDays(first, d); const info = dayInfo(ds); const pr = dayProgress(ds);
      if (pr.complete) doneCount++;
      const cls = [pr.complete ? 'done' : pr.done > 0 ? 'partial' : '', ds === today ? 'today' : '', ds < today && !pr.complete ? 'past' : ''].join(' ');
      cells += `<button class="dcell ${cls}" data-day="${ds}"><span class="wd">${WD[info.wd]}</span><span class="dn">${parseDate(ds).getDate()}</span><span class="ty ${info.code}">${info.code === 'C' ? 'CAR' : info.code === 'E' ? 'EASY' : info.code === 'R' ? 'REST' : info.code}</span></button>`;
    }
    html += `<div class="week"><div class="week-head"><h3>Week ${w} <span class="muted small">· ${shortDate(first)} – ${shortDate(addDays(first, 6))}</span></h3><span class="small muted">${doneCount}/7 days</span></div><div class="grid7">${cells}</div><p class="small muted mt">${PLAN.weekNotes[w - 1]}</p></div>`;
  }
  html += `<div class="section-title">Nutrition targets</div><div class="card"><div class="kv">${PLAN.nutrition.map(([k, v]) => `<div><b>${k}</b>${v}</div>`).join('')}</div></div>`;
  html += `<div class="section-title">Month 1 goals</div><div class="card"><ul class="list-plain">${PLAN.goals.map(g => `<li>${esc(g)}</li>`).join('')}</ul></div>`;
  html += `<div class="section-title">Progressions</div><div class="card">${Object.entries(PLAN.progressions).map(([k, v]) => `<b class="small">${k}</b><div class="prog-chain mb">${v.map((s, i) => `${i ? '<i>→</i>' : ''}<span>${esc(s)}</span>`).join('')}</div>`).join('')}<p class="small muted">Only progress when the current version is pain-free and every rep is clean. Do NOT skip levels because of ego.</p></div>`;
  html += `<div class="section-title">Rules</div><div class="card"><ul class="list-plain">${PLAN.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>`;
  html += `<div class="section-title">Not yet (month 1)</div><div class="card"><div class="prog-chain">${PLAN.notYet.map(s => `<span>✕ ${esc(s)}</span>`).join('')}</div></div>`;
  html += `<div class="section-title">Install</div><div class="card small muted" id="install-help">${installHelp()}</div>`;
  return html;
}
function installHelp() {
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (standalone) return '✓ Installed. Works offline.';
  if (/iphone|ipad|ipod/i.test(navigator.userAgent)) return 'iPhone: open in Safari → tap Share → <b>Add to Home Screen</b>. It then runs full-screen and offline.';
  return deferredPrompt ? '<button class="btn small primary" data-install>Install app</button>' : 'Android / Chrome: menu ⋮ → <b>Install app</b> (or "Add to Home screen").';
}

/* ----- LIBRARY ----- */
function renderLibrary() {
  const groups = ['All', 'Warm-up', 'Workout A', 'Workout B', 'Shoulder', 'Cardio', 'Progression'];
  let html = `<div class="lib-filter">${groups.map(g => `<button class="chip ${g === libFilter ? 'on' : ''}" data-filter="${g}">${g}</button>`).join('')}</div><div class="lib-grid">`;
  Object.entries(EX).filter(([, e]) => libFilter === 'All' || e.group === libFilter).forEach(([id, e]) => {
    html += `<button class="lib-card" data-open="${id}"><div class="fig">${fig(id)}</div><div class="t"><b>${esc(e.name)}</b><span>${e.sets ? `${e.sets} × ${e.reps[0]}–${e.reps[1]} ${e.unit || 'reps'}${e.perSide ? '/side' : ''}` : esc(e.dose || e.group)}</span></div></button>`;
  });
  return html + '</div>';
}
function openSheet(id) {
  const e = EX[id];
  const el = document.createElement('div'); el.className = 'sheet';
  el.innerHTML = `<div class="sheet-card"><button class="sheet-close">✕</button><span class="badge">${esc(e.group)}</span><h2 style="margin-top:8px">${esc(e.name)}</h2>
    <p class="muted small">${e.sets ? `${e.sets} sets × ${e.reps[0]}–${e.reps[1]} ${e.unit || 'reps'}${e.perSide ? ' each side' : ''}${e.rest ? ` · rest ${e.rest}s` : ''}` : esc(e.dose || '')}</p>
    <div class="big-fig">${fig(id)}</div><ul class="list-plain">${e.cues.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>`;
  document.body.appendChild(el); animateFigures(el);
  const close = () => el.remove();
  $('.sheet-close', el).onclick = close; el.addEventListener('click', ev => { if (ev.target === el) close(); });
}

/* ----- PROGRESS ----- */
function renderProgress() {
  const today = todayStr(); const days = [];
  for (let i = 0; i < 28; i++) { const ds = addDays(S.startMonday, i); if (ds <= today) days.push(ds); }
  const completed = days.filter(d => S.logs[d]?.complete).length;
  let streak = 0; for (let i = days.length - 1; i >= 0; i--) { if (S.logs[days[i]]?.complete) streak++; else if (days[i] !== today) break; }
  const sets = Object.values(S.logs).reduce((a, L) => a + Object.values(L.sets || {}).reduce((b, arr) => b + arr.filter(Boolean).length, 0), 0);
  const stepsArr = Object.values(S.logs).map(L => L.steps).filter(n => n > 0);
  const avgSteps = stepsArr.length ? Math.round(stepsArr.reduce((a, b) => a + b, 0) / stepsArr.length) : 0;
  const w = [...S.weights].sort((a, b) => a.d.localeCompare(b.d));
  const startW = w[0]?.kg, lastW = w[w.length - 1]?.kg;
  let html = `<div class="stats"><div class="stat"><b>${completed}<span class="muted" style="font-size:13px">/${days.length}</span></b><span>days done</span></div><div class="stat"><b>${streak}</b><span>day streak</span></div><div class="stat"><b>${sets}</b><span>sets logged</span></div></div>
  <div class="stats"><div class="stat"><b>${lastW ?? '–'}</b><span>weight kg</span></div><div class="stat"><b>${startW && lastW ? (lastW - startW > 0 ? '+' : '') + (lastW - startW).toFixed(1) : '–'}</b><span>change kg</span></div><div class="stat"><b>${avgSteps ? avgSteps.toLocaleString() : '–'}</b><span>avg steps</span></div></div>`;
  /* weight */
  html += `<div class="section-title">Weight · goal 74–75 kg</div><div class="card"><div class="row"><input type="number" inputmode="decimal" step="0.1" placeholder="kg" data-w-in><input type="date" value="${today}" data-w-date style="width:auto"><button class="btn small primary" data-w-add>Log</button></div>${weightChart(w)}<div class="log-list mt">${w.slice(-8).reverse().map(x => `<div class="r"><span>${niceDate(x.d)}</span><span><b>${x.kg} kg</b> <button data-w-del="${x.d}">✕</button></span></div>`).join('')}</div></div>`;
  /* waist */
  const wa = [...S.waist].sort((a, b) => a.d.localeCompare(b.d));
  html += `<div class="section-title">Waist (cm, at the navel)</div><div class="card"><div class="row"><input type="number" inputmode="decimal" step="0.5" placeholder="cm" data-wa-in><button class="btn small primary" data-wa-add>Log</button></div><div class="log-list mt">${wa.slice(-6).reverse().map(x => `<div class="r"><span>${niceDate(x.d)}</span><span><b>${x.cm} cm</b> <button data-wa-del="${x.d}">✕</button></span></div>`).join('') || '<span class="muted small">Measure once a week, same time of day.</span>'}</div></div>`;
  /* pain */
  const painDays = days.filter(d => S.logs[d]?.pain != null);
  html += `<div class="section-title">Left shoulder · pain log</div><div class="card">${painDays.length ? `<div class="bars">${painDays.slice(-28).map(d => { const p = S.logs[d].pain; return `<div class="${p <= 2 ? 'ok' : p <= 4 ? 'warn' : 'bad'}" style="height:${Math.max(4, p * 10)}%" title="${d}: ${p}"></div>`; }).join('')}</div><p class="small muted mt">Green 0–2 fine · yellow 3–4 watch it · red 5+ back off and get it checked if it repeats.</p>` : '<span class="muted small">Log the shoulder in the Today check-in after each session.</span>'}</div>`;
  /* weekly */
  html += `<div class="section-title">Week by week</div><div class="card">`;
  for (let wk = 1; wk <= 4; wk++) {
    const ds = Array.from({ length: 7 }, (_, i) => addDays(S.startMonday, (wk - 1) * 7 + i));
    const done = ds.filter(d => S.logs[d]?.complete).length; const str = ds.filter(d => dayInfo(d).type === 'strength' && S.logs[d]?.complete).length;
    const car = ds.filter(d => S.logs[d]?.cardioDone).length;
    html += `<div class="row between" style="padding:6px 0;border-bottom:1px solid var(--line)"><b>Week ${wk}</b><span class="small muted">${done}/7 days · ${str}/3 strength · ${car}/3 cardio</span></div>`;
  }
  html += `</div>`;
  html += `<div class="section-title">Data</div><div class="card"><div class="row wrap"><button class="btn small" data-export>Copy backup</button><label class="btn small" style="cursor:pointer">Import <input type="file" accept="application/json" data-import hidden></label><button class="btn small ghost" data-reset style="color:var(--red)">Reset everything</button></div><p class="small muted mt">Data lives only on this device (offline). Copy a backup now and then.</p></div>`;
  return html;
}
function weightChart(w) {
  if (w.length < 2) return '<p class="small muted mt">Log at least two weigh-ins to see the trend. Sundays, same conditions.</p>';
  const W = 320, H = 150, px = 28, py = 14;
  const ys = w.map(x => x.kg); const lo = Math.min(...ys, 74) - 1, hi = Math.max(...ys) + 1;
  const t0 = parseDate(w[0].d), t1 = parseDate(w[w.length - 1].d); const span = Math.max(1, t1 - t0);
  const X = d => px + (parseDate(d) - t0) / span * (W - px * 2); const Y = v => py + (hi - v) / (hi - lo) * (H - py * 2);
  const pts = w.map(x => `${X(x.d).toFixed(1)},${Y(x.kg).toFixed(1)}`).join(' ');
  return `<svg class="chart mt" viewBox="0 0 ${W} ${H}"><line class="axis" x1="${px}" y1="${H - py}" x2="${W - px}" y2="${H - py}"/><line class="goal" x1="${px}" y1="${Y(74.5)}" x2="${W - px}" y2="${Y(74.5)}"/><text x="${W - px + 2}" y="${Y(74.5) + 3}">74.5</text>
    <polyline class="line" points="${pts}"/>${w.map(x => `<circle class="dot" cx="${X(x.d)}" cy="${Y(x.kg)}" r="3"/>`).join('')}
    <text x="${px}" y="${H - 2}">${shortDate(w[0].d)}</text><text x="${W - px - 30}" y="${H - 2}">${shortDate(w[w.length - 1].d)}</text><text x="2" y="${py + 3}">${hi.toFixed(0)}</text><text x="2" y="${H - py}">${lo.toFixed(0)}</text></svg>`;
}

/* ---------- events ---------- */
function updateRing() {
  const pr = dayProgress(viewDate); const rw = $('.ring-wrap'); if (!rw) return;
  const c = 2 * Math.PI * 26; $('.rf', rw).style.strokeDashoffset = c * (1 - pr.pct / 100); $('.pct', rw).textContent = pr.pct + '%';
  const st = $$('.section-title')[1]; if (st && st.children[1] && dayInfo(viewDate).type === 'strength') st.children[1].textContent = `${pr.done}/${pr.total}`;
  const btn = $('[data-complete]'); if (btn && !pr.complete) btn.textContent = pr.pct === 100 ? 'Mark day complete' : `Mark day complete (${pr.pct}% done)`;
}
function bind() {
  const L = log(viewDate); const info = dayInfo(viewDate);
  /* today */
  $$('[data-nav]').forEach(b => b.onclick = e => { e.preventDefault(); const n = Number(b.dataset.nav); viewDate = n === 0 ? todayStr() : addDays(viewDate, n); render(); });
  $$('[data-warm]').forEach(el => el.onclick = () => {
    const i = Number(el.dataset.warm); L.warm[i] = !L.warm[i]; save();
    el.classList.toggle('on', L.warm[i]); const c = $('.check', el); c.classList.toggle('on', L.warm[i]); c.textContent = L.warm[i] ? '✓' : '';
    $$('.section-title')[0].children[1].textContent = `${L.warm.filter(Boolean).length}/${PLAN.warmup.length}`; updateRing();
  });
  $$('[data-toggle]').forEach(b => b.onclick = () => { const ex = b.closest('.ex'); ex.classList.toggle('open'); b.textContent = ex.classList.contains('open') ? 'How to do it ▴' : 'How to do it ▾'; });
  $$('[data-set]').forEach(b => b.onclick = () => {
    const [id, iS] = b.dataset.set.split(':'); const i = Number(iS); const ex = EX[id];
    L.sets[id] ||= []; L.sets[id][i] = !L.sets[id][i]; save();
    const on = L.sets[id][i]; b.classList.toggle('done', on);
    b.querySelector('small').textContent = on ? '✓ done' : `${targetReps(ex, info.week)} ${ex.unit || 'reps'}${ex.perSide ? '/side' : ''}`;
    const card = b.closest('.ex'); card.classList.toggle('done', L.sets[id].filter(Boolean).length >= ex.sets);
    updateRing();
    if (on && S.autoRest && ex.rest && i < ex.sets - 1) Timer.open([{ sec: ex.rest, label: 'Rest', sub: `${ex.name} · set ${i + 2} next`, ex: id }]);
  });
  $$('[data-reps]').forEach(inp => inp.onchange = () => { L.reps[inp.dataset.reps] = inp.value === '' ? null : Number(inp.value); save(); });
  $$('[data-rest]').forEach(b => b.onclick = () => Timer.open([{ sec: Number(b.dataset.rest), label: 'Rest', sub: b.dataset.restname }]));
  $$('[data-pushup]').forEach(sel => sel.onchange = () => { S.pushupLevel = sel.value; save(); render(); toast('Push-up level updated'); });
  $$('[data-min]').forEach(b => b.onclick = () => { L.cardioMin = Number(b.dataset.min); save(); render(); });
  const circ = $('[data-circuit]'); if (circ) circ.onclick = () => {
    const mins = L.cardioMin || info.cardioMin; const steps = []; let t = 0, round = 1;
    while (t < mins * 60) { for (const c of PLAN.cardioCircuit) { if (t >= mins * 60) break; const sec = Math.min(c.sec, mins * 60 - t); steps.push({ sec, label: `Round ${round} · ${mmss(mins * 60 - t)} left`, sub: EX[c.id].name, ex: c.id, work: true }); t += sec; } round++; }
    Timer.open(steps, { onDone: auto => { if (auto) { L.cardioDone = true; L.cardioMin = mins; save(); render(); toast(`Cardio logged · ${mins} min`); } } });
  };
  const cd = $('[data-cardio-done]'); if (cd) cd.onclick = () => { L.cardioDone = !L.cardioDone; if (L.cardioDone) L.cardioMin = L.cardioMin || info.cardioMin; save(); render(); };
  const pain = $('[data-pain]'); if (pain) pain.oninput = () => { L.pain = Number(pain.value); save(); const v = $('#pain-val'); v.textContent = L.pain; v.className = 'pain-val ' + (L.pain <= 2 ? 'ok' : L.pain <= 4 ? 'warn' : 'bad'); };
  if (pain) pain.onchange = () => render();
  const steps = $('[data-steps]'); if (steps) steps.onchange = () => { L.steps = steps.value === '' ? null : Number(steps.value); save(); };
  const wt = $('[data-weight]'); if (wt) wt.onchange = () => { if (!wt.value) return; addWeight(viewDate, Number(wt.value)); toast('Weight logged'); };
  const notes = $('[data-notes]'); if (notes) notes.onchange = () => { L.notes = notes.value; save(); };
  const comp = $('[data-complete]'); if (comp) comp.onclick = () => { L.complete = !L.complete; save(); render(); if (L.complete) { beep(1046, 120, 2); toast(info.type === 'rest' ? 'Rest day logged' : 'Session logged. Better than Day 1.'); } };
  /* plan */
  const st = $('[data-start]'); if (st) st.onchange = () => { if (!st.value) return; S.startMonday = mondayOf(st.value); save(); render(); toast(`Week 1 starts Monday ${shortDate(S.startMonday)}`); };
  const ar = $('[data-autorest]'); if (ar) ar.onclick = () => { S.autoRest = !S.autoRest; save(); render(); };
  const so = $('[data-sound]'); if (so) so.onclick = () => { S.sound = !S.sound; save(); render(); };
  $$('[data-day]').forEach(b => b.onclick = () => { viewDate = b.dataset.day; tab = 'today'; render(); });
  const ib = $('[data-install]'); if (ib) ib.onclick = doInstall;
  /* library */
  $$('[data-filter]').forEach(b => b.onclick = () => { libFilter = b.dataset.filter; render(); });
  $$('[data-open]').forEach(b => b.onclick = () => openSheet(b.dataset.open));
  /* progress */
  const wa = $('[data-w-add]'); if (wa) wa.onclick = () => { const v = Number($('[data-w-in]').value); if (!v) return; addWeight($('[data-w-date]').value || todayStr(), v); render(); };
  $$('[data-w-del]').forEach(b => b.onclick = () => { S.weights = S.weights.filter(x => x.d !== b.dataset.wDel); save(); render(); });
  const waa = $('[data-wa-add]'); if (waa) waa.onclick = () => { const v = Number($('[data-wa-in]').value); if (!v) return; S.waist = S.waist.filter(x => x.d !== todayStr()); S.waist.push({ d: todayStr(), cm: v }); save(); render(); };
  $$('[data-wa-del]').forEach(b => b.onclick = () => { S.waist = S.waist.filter(x => x.d !== b.dataset.waDel); save(); render(); });
  const ex = $('[data-export]'); if (ex) ex.onclick = async () => { const txt = JSON.stringify(S); try { await navigator.clipboard.writeText(txt); toast('Backup copied to clipboard'); } catch (e) { prompt('Copy this backup:', txt); } };
  const im = $('[data-import]'); if (im) im.onchange = () => { const f = im.files[0]; if (!f) return; f.text().then(t => { try { S = Object.assign(DEFAULT(), JSON.parse(t)); save(); render(); toast('Backup imported'); } catch (e) { toast('Invalid file'); } }); };
  const rs = $('[data-reset]'); if (rs) rs.onclick = () => { if (confirm('Delete all logs, weights and settings on this device?')) { S = DEFAULT(); save(); render(); } };
}
function addWeight(d, kg) { S.weights = S.weights.filter(x => x.d !== d); S.weights.push({ d, kg }); save(); }

$('#tabbar').addEventListener('click', e => { const b = e.target.closest('.tab'); if (!b) return; tab = b.dataset.tab; if (tab === 'today') viewDate = todayStr(); render(); });

/* ---------- install / PWA ---------- */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; if (!S.installDismissed) $('#install-banner').hidden = false; const h = $('#install-help'); if (h) h.innerHTML = installHelp(); const ib = $('[data-install]'); if (ib) ib.onclick = doInstall; });
async function doInstall() { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $('#install-banner').hidden = true; }
$('#install-btn').onclick = doInstall;
$('#install-dismiss').onclick = () => { S.installDismissed = true; save(); $('#install-banner').hidden = true; };
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
document.addEventListener('visibilitychange', () => { if (!document.hidden && tab === 'today' && viewDate !== todayStr() && dayInfo(viewDate).idx < dayInfo(todayStr()).idx - 1) { /* keep user's chosen day */ } });

render();
})();

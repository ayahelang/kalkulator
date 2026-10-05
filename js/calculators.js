/**
 * Functional calculators for Silverhawk Kalkulator App
 */

export function renderCalculator(id, container, playClick) {
  const map = {
    basic: renderBasic,
    scientific: renderScientific,
    percentage: renderPercentage,
    bmi: renderBMI,
    egfr: renderEGFR,
    bmr: renderBMR,
    dosage: renderDosage,
    subnet: renderSubnet,
    ohm: renderOhm,
    'led-resistor': renderLED,
    'resistor-color': renderResistorColor,
    'voltage-divider': renderVoltageDivider,
    'rc-time': renderRC,
    'gear-ratio': renderGearRatio,
    'hp-torque': renderHPTorque,
    'fuel-economy': renderFuel,
    kinematics: renderKinematics,
    projectile: renderProjectile,
    'free-fall': renderFreeFall,
    'delta-v': renderDeltaV,
    orbital: renderOrbital,
    npv: renderNPV,
    loan: renderLoan,
    compound: renderCompound,
    roi: renderROI,
    'break-even': renderBreakEven,
    'percentage-business': renderMargin,
    'unit-converter': renderUnitConverter,
    'date-diff': renderDateDiff,
    age: renderAge
  };

  const fn = map[id] || (() => {
    container.innerHTML = `<p style="color:var(--text-muted)">Kalkulator ini sedang dalam pengembangan.</p>`;
  });
  fn(container, playClick);
}

/* ========== BASIC ========== */
function renderBasic(el, play) {
  el.innerHTML = `
    <div class="calc-display">
      <div class="calc-expr" id="bExpr"></div>
      <div class="calc-result" id="bRes">0</div>
    </div>
    <div class="calc-keys" id="bKeys"></div>
  `;
  const keys = ['C','±','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','='];
  const keyEl = el.querySelector('#bKeys');
  keys.forEach(k => {
    const btn = document.createElement('button');
    btn.className = 'calc-btn' + (k === 'C' ? ' clear' : ['÷','×','−','+'].includes(k) ? ' op' : k === '=' ? ' eq' : k === '0' ? ' zero' : '');
    btn.textContent = k;
    btn.addEventListener('click', () => { play(); handleBasic(k); });
    keyEl.appendChild(btn);
  });

  let current = '0', previous = '', op = null, reset = false;
  const res = el.querySelector('#bRes');
  const expr = el.querySelector('#bExpr');

  function handleBasic(k) {
    if (k === 'C') { current = '0'; previous = ''; op = null; reset = false; }
    else if (k === '±') current = String(-parseFloat(current));
    else if (k === '%') current = String(parseFloat(current) / 100);
    else if (['÷','×','−','+'].includes(k)) {
      if (op && !reset) compute();
      previous = current; op = k; reset = true;
    } else if (k === '=') { compute(); op = null; }
    else if (k === '.') {
      if (reset) { current = '0.'; reset = false; }
      else if (!current.includes('.')) current += '.';
    } else {
      if (reset || current === '0') { current = k; reset = false; }
      else current += k;
    }
    update();
  }
  function compute() {
    const a = parseFloat(previous), b = parseFloat(current);
    if (isNaN(a) || isNaN(b)) return;
    let r;
    switch (op) {
      case '+': r = a + b; break;
      case '−': r = a - b; break;
      case '×': r = a * b; break;
      case '÷': r = b === 0 ? 'Error' : a / b; break;
    }
    current = String(r);
    previous = '';
  }
  function update() {
    res.textContent = current;
    expr.textContent = op ? `${previous} ${op}` : '';
  }
}

/* ========== SCIENTIFIC ========== */
function renderScientific(el, play) {
  el.innerHTML = `
    <div class="calc-display">
      <div class="calc-expr" id="sExpr"></div>
      <div class="calc-result" id="sRes">0</div>
    </div>
    <div class="calc-keys" id="sKeys" style="grid-template-columns:repeat(5,1fr)"></div>
  `;
  const keys = [
    'sin','cos','tan','log','ln',
    '√','x²','xʸ','π','e',
    'C','(',')','÷','%',
    '7','8','9','×','±',
    '4','5','6','−','1/x',
    '1','2','3','+','=',
    '0','.'
  ];
  const keyEl = el.querySelector('#sKeys');
  keys.forEach(k => {
    const btn = document.createElement('button');
    let cls = 'calc-btn';
    if (['sin','cos','tan','log','ln','√','x²','xʸ','π','e','1/x'].includes(k)) cls += ' fn';
    else if (['÷','×','−','+'].includes(k)) cls += ' op';
    else if (k === 'C') cls += ' clear';
    else if (k === '=') cls += ' eq';
    btn.className = cls;
    btn.textContent = k;
    btn.style.fontSize = k.length > 2 ? '0.75rem' : '';
    if (k === '0') btn.style.gridColumn = 'span 2';
    if (k === '=') btn.style.gridColumn = 'span 2';
    btn.addEventListener('click', () => { play(700); handleSci(k); });
    keyEl.appendChild(btn);
  });

  let exprStr = '', display = '0';
  const res = el.querySelector('#sRes');
  const exprEl = el.querySelector('#sExpr');

  function handleSci(k) {
    try {
      if (k === 'C') { exprStr = ''; display = '0'; }
      else if (k === '=') {
        let e = exprStr.replace(/×/g,'*').replace(/÷/g,'/').replace(/π/g,'Math.PI').replace(/e(?![a-z])/g,'Math.E');
        e = e.replace(/sin\(/g,'Math.sin(').replace(/cos\(/g,'Math.cos(').replace(/tan\(/g,'Math.tan(');
        e = e.replace(/log\(/g,'Math.log10(').replace(/ln\(/g,'Math.log(').replace(/√\(/g,'Math.sqrt(');
        const r = Function('"use strict"; return (' + e + ')')();
        display = Number.isFinite(r) ? +r.toPrecision(10) : 'Error';
        exprStr = String(display);
      }
      else if (k === 'sin' || k === 'cos' || k === 'tan' || k === 'log' || k === 'ln' || k === '√') {
        exprStr += k + '('; display = exprStr;
      }
      else if (k === 'x²') { exprStr += '**2'; display = exprStr; }
      else if (k === 'xʸ') { exprStr += '**'; display = exprStr; }
      else if (k === 'π') { exprStr += 'π'; display = exprStr; }
      else if (k === 'e') { exprStr += 'e'; display = exprStr; }
      else if (k === '±') {
        if (exprStr) { exprStr = '(-(' + exprStr + '))'; display = exprStr; }
      }
      else if (k === '1/x') { exprStr = '1/(' + (exprStr || '0') + ')'; display = exprStr; }
      else if (k === '%') { exprStr += '/100'; display = exprStr; }
      else {
        if (display === '0' && !isNaN(k)) exprStr = k;
        else exprStr += k;
        display = exprStr;
      }
    } catch { display = 'Error'; }
    res.textContent = display;
    exprEl.textContent = exprStr !== display ? exprStr : '';
  }
}

/* ========== PERCENTAGE ========== */
function renderPercentage(el, play) {
  el.innerHTML = formHTML([
    { id: 'pVal', label: 'Nilai', placeholder: '100' },
    { id: 'pPct', label: 'Persentase (%)', placeholder: '15' }
  ], 'Hitung') + `<div class="result-box" id="pOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const v = +el.querySelector('#pVal').value;
    const p = +el.querySelector('#pPct').value;
    const of = v * p / 100;
    const up = v * (1 + p / 100);
    const down = v * (1 - p / 100);
    const out = el.querySelector('#pOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">${p}% dari ${v}</div>
      <div class="value">${fmt(of)}</div>
      <div class="detail">Setelah naik ${p}%: <strong>${fmt(up)}</strong><br>Setelah turun ${p}%: <strong>${fmt(down)}</strong></div>
    `;
  };
}

/* ========== BMI ========== */
function renderBMI(el, play) {
  el.innerHTML = formHTML([
    { id: 'bmiH', label: 'Tinggi (cm)', placeholder: '170' },
    { id: 'bmiW', label: 'Berat (kg)', placeholder: '65' }
  ], 'Hitung BMI') + `<div class="result-box" id="bmiOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const h = +el.querySelector('#bmiH').value / 100;
    const w = +el.querySelector('#bmiW').value;
    if (!h || !w) return;
    const bmi = w / (h * h);
    let cat = '', color = '';
    if (bmi < 18.5) { cat = 'Underweight'; color = 'var(--warning)'; }
    else if (bmi < 25) { cat = 'Normal'; color = 'var(--success)'; }
    else if (bmi < 30) { cat = 'Overweight'; color = 'var(--warning)'; }
    else { cat = 'Obese'; color = 'var(--danger)'; }
    const out = el.querySelector('#bmiOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">BMI Anda</div>
      <div class="value" style="color:${color}">${bmi.toFixed(1)}</div>
      <div class="detail">Kategori: <strong style="color:${color}">${cat}</strong></div>
    `;
  };
}

/* ========== eGFR ========== */
function renderEGFR(el, play) {
  el.innerHTML = formHTML([
    { id: 'egAge', label: 'Usia (tahun)', placeholder: '45' },
    { id: 'egSex', label: 'Jenis Kelamin', type: 'select', options: [['male','Laki-laki'],['female','Perempuan']] },
    { id: 'egCr', label: 'Serum Kreatinin (mg/dL)', placeholder: '1.0' }
  ], 'Hitung eGFR') + `<div class="result-box" id="egOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const age = +el.querySelector('#egAge').value;
    const sex = el.querySelector('#egSex').value;
    const scr = +el.querySelector('#egCr').value;
    if (!age || !scr) return;
    // CKD-EPI 2021 (race-free)
    const k = sex === 'female' ? 0.7 : 0.9;
    const a = sex === 'female' ? -0.241 : -0.302;
    const min = Math.min(scr / k, 1);
    const max = Math.max(scr / k, 1);
    let egfr = 142 * Math.pow(min, a) * Math.pow(max, -1.200) * Math.pow(0.9938, age);
    if (sex === 'female') egfr *= 1.012;
    let stage = '';
    if (egfr >= 90) stage = 'G1 – Normal / Tinggi';
    else if (egfr >= 60) stage = 'G2 – Menurun ringan';
    else if (egfr >= 45) stage = 'G3a – Menurun ringan-sedang';
    else if (egfr >= 30) stage = 'G3b – Menurun sedang-berat';
    else if (egfr >= 15) stage = 'G4 – Menurun berat';
    else stage = 'G5 – Gagal ginjal';
    const out = el.querySelector('#egOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">eGFR (CKD-EPI 2021)</div>
      <div class="value">${egfr.toFixed(1)} mL/min/1.73m²</div>
      <div class="detail">Stadium: <strong>${stage}</strong></div>
    `;
  };
}

/* ========== BMR / TDEE ========== */
function renderBMR(el, play) {
  el.innerHTML = formHTML([
    { id: 'bmrAge', label: 'Usia', placeholder: '30' },
    { id: 'bmrSex', label: 'Jenis Kelamin', type: 'select', options: [['m','Laki-laki'],['f','Perempuan']] },
    { id: 'bmrH', label: 'Tinggi (cm)', placeholder: '170' },
    { id: 'bmrW', label: 'Berat (kg)', placeholder: '70' },
    { id: 'bmrAct', label: 'Aktivitas', type: 'select', options: [
      ['1.2','Sedentari (jarang olahraga)'],
      ['1.375','Ringan (1-3 hari/minggu)'],
      ['1.55','Sedang (3-5 hari)'],
      ['1.725','Berat (6-7 hari)'],
      ['1.9','Sangat berat / atlet']
    ]}
  ], 'Hitung BMR & TDEE') + `<div class="result-box" id="bmrOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const age = +el.querySelector('#bmrAge').value;
    const sex = el.querySelector('#bmrSex').value;
    const h = +el.querySelector('#bmrH').value;
    const w = +el.querySelector('#bmrW').value;
    const act = +el.querySelector('#bmrAct').value;
    // Mifflin-St Jeor
    let bmr = sex === 'm' ? 10 * w + 6.25 * h - 5 * age + 5 : 10 * w + 6.25 * h - 5 * age - 161;
    const tdee = bmr * act;
    const out = el.querySelector('#bmrOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">BMR (Basal Metabolic Rate)</div>
      <div class="value">${Math.round(bmr)} kcal/hari</div>
      <div class="detail">TDEE (kebutuhan harian): <strong>${Math.round(tdee)} kcal</strong><br>
      Defisit 20%: ~${Math.round(tdee * 0.8)} kcal · Surplus 10%: ~${Math.round(tdee * 1.1)} kcal</div>
    `;
  };
}

/* ========== DOSAGE ========== */
function renderDosage(el, play) {
  el.innerHTML = formHTML([
    { id: 'dosW', label: 'Berat Badan (kg)', placeholder: '70' },
    { id: 'dosDose', label: 'Dosis (mg/kg)', placeholder: '10' },
    { id: 'dosConc', label: 'Konsentrasi (mg/mL) – opsional', placeholder: '50' }
  ], 'Hitung Dosis') + `<div class="result-box" id="dosOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const w = +el.querySelector('#dosW').value;
    const d = +el.querySelector('#dosDose').value;
    const c = +el.querySelector('#dosConc').value;
    if (!w || !d) return;
    const total = w * d;
    let extra = '';
    if (c) extra = `<br>Volume yang dibutuhkan: <strong>${(total / c).toFixed(2)} mL</strong>`;
    const out = el.querySelector('#dosOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">Total Dosis</div>
      <div class="value">${fmt(total)} mg</div>
      <div class="detail">${d} mg/kg × ${w} kg${extra}</div>
    `;
  };
}

/* ========== SUBNET ========== */
function renderSubnet(el, play) {
  el.innerHTML = formHTML([
    { id: 'subIP', label: 'IP Address', placeholder: '192.168.1.10' },
    { id: 'subCIDR', label: 'CIDR / Prefix', placeholder: '24' }
  ], 'Hitung Subnet') + `<div class="result-box" id="subOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const ip = el.querySelector('#subIP').value.trim();
    const cidr = +el.querySelector('#subCIDR').value;
    if (!ip || cidr < 0 || cidr > 32) return;
    try {
      const parts = ip.split('.').map(Number);
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) throw 0;
      const ipNum = (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
      const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
      const net = (ipNum & mask) >>> 0;
      const bcast = (net | (~mask >>> 0)) >>> 0;
      const hosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.pow(2, 32 - cidr) - 2;
      const first = cidr >= 31 ? net : net + 1;
      const last = cidr >= 31 ? bcast : bcast - 1;
      const maskStr = [24,16,8,0].map(s => (mask >>> s) & 255).join('.');
      const out = el.querySelector('#subOut');
      out.style.display = 'block';
      out.innerHTML = `
        <div class="label">Network Address</div>
        <div class="value" style="font-size:1.1rem">${numToIP(net)}</div>
        <div class="detail">
          Broadcast: <strong>${numToIP(bcast)}</strong><br>
          Subnet Mask: <strong>${maskStr}</strong><br>
          First Host: <strong>${numToIP(first)}</strong><br>
          Last Host: <strong>${numToIP(last)}</strong><br>
          Usable Hosts: <strong>${hosts}</strong>
        </div>
      `;
    } catch {
      el.querySelector('#subOut').style.display = 'block';
      el.querySelector('#subOut').innerHTML = `<div class="value" style="color:var(--danger)">IP tidak valid</div>`;
    }
  };
  function numToIP(n) {
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
  }
}

/* ========== OHM ========== */
function renderOhm(el, play) {
  el.innerHTML = `
    <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:1rem">Isi 2 nilai, biarkan yang dicari kosong.</p>
    ${formHTML([
      { id: 'ohmV', label: 'Voltage (V)', placeholder: '' },
      { id: 'ohmI', label: 'Current (A)', placeholder: '' },
      { id: 'ohmR', label: 'Resistance (Ω)', placeholder: '' },
      { id: 'ohmP', label: 'Power (W)', placeholder: '' }
    ], 'Hitung')}
    <div class="result-box" id="ohmOut" style="display:none"></div>
  `;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    let V = el.querySelector('#ohmV').value;
    let I = el.querySelector('#ohmI').value;
    let R = el.querySelector('#ohmR').value;
    let P = el.querySelector('#ohmP').value;
    V = V === '' ? null : +V; I = I === '' ? null : +I; R = R === '' ? null : +R; P = P === '' ? null : +P;
    if (V !== null && I !== null) { R = V / I; P = V * I; }
    else if (V !== null && R !== null) { I = V / R; P = V * V / R; }
    else if (I !== null && R !== null) { V = I * R; P = I * I * R; }
    else if (P !== null && V !== null) { I = P / V; R = V * V / P; }
    else if (P !== null && I !== null) { V = P / I; R = P / (I * I); }
    else if (P !== null && R !== null) { I = Math.sqrt(P / R); V = I * R; }
    else return;
    const out = el.querySelector('#ohmOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="detail">
        V = <strong>${fmt(V)} V</strong><br>
        I = <strong>${fmt(I)} A</strong><br>
        R = <strong>${fmt(R)} Ω</strong><br>
        P = <strong>${fmt(P)} W</strong>
      </div>
    `;
  };
}

/* ========== LED RESISTOR ========== */
function renderLED(el, play) {
  el.innerHTML = formHTML([
    { id: 'ledVs', label: 'Supply Voltage (V)', placeholder: '5' },
    { id: 'ledVf', label: 'LED Forward Voltage (V)', placeholder: '2.0' },
    { id: 'ledIf', label: 'LED Current (mA)', placeholder: '20' }
  ], 'Hitung Resistor') + `<div class="result-box" id="ledOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const vs = +el.querySelector('#ledVs').value;
    const vf = +el.querySelector('#ledVf').value;
    const ifm = +el.querySelector('#ledIf').value / 1000;
    if (!vs || !vf || !ifm) return;
    const r = (vs - vf) / ifm;
    const p = (vs - vf) * ifm;
    const out = el.querySelector('#ledOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">Resistor yang dibutuhkan</div>
      <div class="value">${fmt(r)} Ω</div>
      <div class="detail">Daya minimum: <strong>${fmt(p * 1000)} mW</strong> (pilih ≥ ${Math.ceil(p * 2 * 1000)} mW untuk safety)</div>
    `;
  };
}

/* ========== RESISTOR COLOR ========== */
function renderResistorColor(el, play) {
  const colors = [
    { name: 'Black', val: 0, hex: '#1a1a1a' },
    { name: 'Brown', val: 1, hex: '#8B4513' },
    { name: 'Red', val: 2, hex: '#dc2626' },
    { name: 'Orange', val: 3, hex: '#f97316' },
    { name: 'Yellow', val: 4, hex: '#eab308' },
    { name: 'Green', val: 5, hex: '#22c55e' },
    { name: 'Blue', val: 6, hex: '#3b82f6' },
    { name: 'Violet', val: 7, hex: '#8b5cf6' },
    { name: 'Grey', val: 8, hex: '#6b7280' },
    { name: 'White', val: 9, hex: '#f8fafc' }
  ];
  const mult = [...colors, { name: 'Gold', val: 0.1, hex: '#d4a017' }, { name: 'Silver', val: 0.01, hex: '#c0c0c0' }];
  el.innerHTML = `
    <div class="form-group"><label>Band 1 (digit 1)</label><select id="rc1">${colors.map((c,i)=>`<option value="${i}">${c.name}</option>`).join('')}</select></div>
    <div class="form-group"><label>Band 2 (digit 2)</label><select id="rc2">${colors.map((c,i)=>`<option value="${i}">${c.name}</option>`).join('')}</select></div>
    <div class="form-group"><label>Band 3 (multiplier)</label><select id="rc3">${mult.map((c,i)=>`<option value="${i}">${c.name}</option>`).join('')}</select></div>
    <button class="btn-calc">Decode</button>
    <div class="result-box" id="rcOut" style="display:none"></div>
  `;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const d1 = colors[+el.querySelector('#rc1').value].val;
    const d2 = colors[+el.querySelector('#rc2').value].val;
    const m = mult[+el.querySelector('#rc3').value].val;
    const r = (d1 * 10 + d2) * (typeof m === 'number' && m < 1 ? m : Math.pow(10, m));
    const out = el.querySelector('#rcOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">Nilai Resistor</div><div class="value">${fmtOhm(r)}</div>`;
  };
}

/* ========== VOLTAGE DIVIDER ========== */
function renderVoltageDivider(el, play) {
  el.innerHTML = formHTML([
    { id: 'vdVin', label: 'Vin (V)', placeholder: '12' },
    { id: 'vdR1', label: 'R1 (Ω)', placeholder: '1000' },
    { id: 'vdR2', label: 'R2 (Ω)', placeholder: '1000' }
  ], 'Hitung Vout') + `<div class="result-box" id="vdOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const vin = +el.querySelector('#vdVin').value;
    const r1 = +el.querySelector('#vdR1').value;
    const r2 = +el.querySelector('#vdR2').value;
    if (!vin || !r1 || !r2) return;
    const vout = vin * r2 / (r1 + r2);
    const out = el.querySelector('#vdOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">Vout</div><div class="value">${fmt(vout)} V</div>`;
  };
}

/* ========== RC TIME ========== */
function renderRC(el, play) {
  el.innerHTML = formHTML([
    { id: 'rcR', label: 'Resistance (Ω)', placeholder: '10000' },
    { id: 'rcC', label: 'Capacitance (µF)', placeholder: '100' }
  ], 'Hitung τ') + `<div class="result-box" id="rcOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const r = +el.querySelector('#rcR').value;
    const c = +el.querySelector('#rcC').value * 1e-6;
    if (!r || !c) return;
    const tau = r * c;
    const out = el.querySelector('#rcOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">Time Constant (τ)</div>
      <div class="value">${fmt(tau)} s</div>
      <div class="detail">≈ 63.2% charge in 1τ · ≈ 99.3% in 5τ (${fmt(5 * tau)} s)</div>
    `;
  };
}

/* ========== GEAR RATIO ========== */
function renderGearRatio(el, play) {
  el.innerHTML = formHTML([
    { id: 'grTeeth1', label: 'Driven Teeth', placeholder: '40' },
    { id: 'grTeeth2', label: 'Driver Teeth', placeholder: '10' },
    { id: 'grRPM', label: 'Input RPM (opsional)', placeholder: '3000' }
  ], 'Hitung Rasio') + `<div class="result-box" id="grOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const d = +el.querySelector('#grTeeth1').value;
    const r = +el.querySelector('#grTeeth2').value;
    const rpm = +el.querySelector('#grRPM').value;
    if (!d || !r) return;
    const ratio = d / r;
    let extra = '';
    if (rpm) extra = `<br>Output RPM: <strong>${fmt(rpm / ratio)}</strong>`;
    const out = el.querySelector('#grOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">Gear Ratio</div><div class="value">${ratio.toFixed(3)} : 1</div><div class="detail">${extra}</div>`;
  };
}

/* ========== HP TORQUE ========== */
function renderHPTorque(el, play) {
  el.innerHTML = formHTML([
    { id: 'htVal', label: 'Nilai', placeholder: '200' },
    { id: 'htType', label: 'Tipe', type: 'select', options: [['hp','Horsepower'],['tq','Torque (lb-ft)']] },
    { id: 'htRPM', label: 'RPM', placeholder: '5000' }
  ], 'Konversi') + `<div class="result-box" id="htOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const v = +el.querySelector('#htVal').value;
    const type = el.querySelector('#htType').value;
    const rpm = +el.querySelector('#htRPM').value;
    if (!v || !rpm) return;
    let result, label;
    if (type === 'hp') { result = v * 5252 / rpm; label = 'Torque (lb-ft)'; }
    else { result = v * rpm / 5252; label = 'Horsepower'; }
    const out = el.querySelector('#htOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">${label}</div><div class="value">${fmt(result)}</div>`;
  };
}

/* ========== FUEL ========== */
function renderFuel(el, play) {
  el.innerHTML = formHTML([
    { id: 'fuDist', label: 'Jarak (km)', placeholder: '400' },
    { id: 'fuLit', label: 'Bahan Bakar (liter)', placeholder: '30' }
  ], 'Hitung Konsumsi') + `<div class="result-box" id="fuOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const d = +el.querySelector('#fuDist').value;
    const l = +el.querySelector('#fuLit').value;
    if (!d || !l) return;
    const kml = d / l;
    const l100 = 100 / kml;
    const out = el.querySelector('#fuOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">Konsumsi</div>
      <div class="value">${kml.toFixed(2)} km/L</div>
      <div class="detail">atau <strong>${l100.toFixed(2)} L/100km</strong></div>
    `;
  };
}

/* ========== KINEMATICS ========== */
function renderKinematics(el, play) {
  el.innerHTML = `
    <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.8rem">Isi yang diketahui, biarkan yang dicari kosong.</p>
    ${formHTML([
      { id: 'kinU', label: 'u (kecepatan awal m/s)', placeholder: '' },
      { id: 'kinV', label: 'v (kecepatan akhir m/s)', placeholder: '' },
      { id: 'kinA', label: 'a (percepatan m/s²)', placeholder: '' },
      { id: 'kinT', label: 't (waktu s)', placeholder: '' },
      { id: 'kinS', label: 's (jarak m)', placeholder: '' }
    ], 'Selesaikan')}
    <div class="result-box" id="kinOut" style="display:none"></div>
  `;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    let u = val('kinU'), v = val('kinV'), a = val('kinA'), t = val('kinT'), s = val('kinS');
    // Simple solver for common cases
    if (u !== null && a !== null && t !== null) { v = u + a * t; s = u * t + 0.5 * a * t * t; }
    else if (u !== null && v !== null && t !== null) { a = (v - u) / t; s = (u + v) / 2 * t; }
    else if (u !== null && v !== null && a !== null) { t = (v - u) / a; s = (v * v - u * u) / (2 * a); }
    else if (u !== null && a !== null && s !== null) { v = Math.sqrt(u * u + 2 * a * s); t = (v - u) / a; }
    else if (v !== null && a !== null && s !== null) { u = Math.sqrt(v * v - 2 * a * s); t = (v - u) / a; }
    else return;
    const out = el.querySelector('#kinOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">
      u = <strong>${fmt(u)}</strong> m/s<br>
      v = <strong>${fmt(v)}</strong> m/s<br>
      a = <strong>${fmt(a)}</strong> m/s²<br>
      t = <strong>${fmt(t)}</strong> s<br>
      s = <strong>${fmt(s)}</strong> m
    </div>`;
  };
  function val(id) { const v = el.querySelector('#' + id).value; return v === '' ? null : +v; }
}

/* ========== PROJECTILE ========== */
function renderProjectile(el, play) {
  el.innerHTML = formHTML([
    { id: 'prV', label: 'Kecepatan awal (m/s)', placeholder: '50' },
    { id: 'prAngle', label: 'Sudut (derajat)', placeholder: '45' },
    { id: 'prG', label: 'Gravitasi (m/s²)', placeholder: '9.81' }
  ], 'Hitung') + `<div class="result-box" id="prOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const v = +el.querySelector('#prV').value;
    const ang = +el.querySelector('#prAngle').value * Math.PI / 180;
    const g = +el.querySelector('#prG').value || 9.81;
    if (!v) return;
    const range = v * v * Math.sin(2 * ang) / g;
    const hmax = v * v * Math.sin(ang) ** 2 / (2 * g);
    const time = 2 * v * Math.sin(ang) / g;
    const out = el.querySelector('#prOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">Hasil Gerak Parabola</div>
      <div class="detail">
        Jangkauan: <strong>${fmt(range)} m</strong><br>
        Tinggi Maks: <strong>${fmt(hmax)} m</strong><br>
        Waktu Terbang: <strong>${fmt(time)} s</strong>
      </div>
    `;
  };
}

/* ========== FREE FALL ========== */
function renderFreeFall(el, play) {
  el.innerHTML = formHTML([
    { id: 'ffH', label: 'Ketinggian (m)', placeholder: '100' },
    { id: 'ffG', label: 'Gravitasi (m/s²)', placeholder: '9.81' }
  ], 'Hitung') + `<div class="result-box" id="ffOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const h = +el.querySelector('#ffH').value;
    const g = +el.querySelector('#ffG').value || 9.81;
    if (!h) return;
    const t = Math.sqrt(2 * h / g);
    const v = g * t;
    const out = el.querySelector('#ffOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="detail">
        Waktu jatuh: <strong>${fmt(t)} s</strong><br>
        Kecepatan dampak: <strong>${fmt(v)} m/s</strong> (${fmt(v * 3.6)} km/h)
      </div>
    `;
  };
}

/* ========== DELTA-V ========== */
function renderDeltaV(el, play) {
  el.innerHTML = formHTML([
    { id: 'dvIsp', label: 'Specific Impulse Isp (s)', placeholder: '300' },
    { id: 'dvM0', label: 'Mass awal m₀ (kg)', placeholder: '100000' },
    { id: 'dvMf', label: 'Mass akhir mf (kg)', placeholder: '30000' }
  ], 'Hitung Δv') + `<div class="result-box" id="dvOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const isp = +el.querySelector('#dvIsp').value;
    const m0 = +el.querySelector('#dvM0').value;
    const mf = +el.querySelector('#dvMf').value;
    if (!isp || !m0 || !mf || m0 <= mf) return;
    const ve = isp * 9.80665;
    const dv = ve * Math.log(m0 / mf);
    const out = el.querySelector('#dvOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">Delta-V</div>
      <div class="value">${fmt(dv)} m/s</div>
      <div class="detail">${(dv / 1000).toFixed(2)} km/s · Mass ratio: ${(m0 / mf).toFixed(2)}</div>
    `;
  };
}

/* ========== ORBITAL ========== */
function renderOrbital(el, play) {
  el.innerHTML = formHTML([
    { id: 'orAlt', label: 'Altitude (km di atas permukaan)', placeholder: '400' },
    { id: 'orBody', label: 'Benda langit', type: 'select', options: [
      ['earth','Bumi (μ=3.986e14)'],
      ['moon','Bulan (μ=4.905e12)'],
      ['mars','Mars (μ=4.283e13)']
    ]}
  ], 'Hitung Orbit') + `<div class="result-box" id="orOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const alt = +el.querySelector('#orAlt').value * 1000;
    const body = el.querySelector('#orBody').value;
    const data = { earth: { mu: 3.986e14, r: 6371e3 }, moon: { mu: 4.905e12, r: 1737e3 }, mars: { mu: 4.283e13, r: 3389e3 } };
    const { mu, r } = data[body];
    const radius = r + alt;
    const v = Math.sqrt(mu / radius);
    const T = 2 * Math.PI * Math.sqrt(radius ** 3 / mu);
    const vesc = Math.sqrt(2 * mu / radius);
    const out = el.querySelector('#orOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="detail">
        Kecepatan Orbit: <strong>${fmt(v)} m/s</strong> (${fmt(v * 3.6)} km/h)<br>
        Periode: <strong>${fmt(T / 60)} menit</strong> (${fmt(T / 3600)} jam)<br>
        Escape Velocity: <strong>${fmt(vesc)} m/s</strong>
      </div>
    `;
  };
}

/* ========== NPV ========== */
function renderNPV(el, play) {
  el.innerHTML = formHTML([
    { id: 'npvRate', label: 'Discount Rate (%)', placeholder: '10' },
    { id: 'npvCF', label: 'Cash Flows (pisahkan koma, tahun 0 dulu)', placeholder: '-100000,30000,40000,50000,60000' }
  ], 'Hitung NPV') + `<div class="result-box" id="npvOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const rate = +el.querySelector('#npvRate').value / 100;
    const cfs = el.querySelector('#npvCF').value.split(',').map(s => +s.trim()).filter(n => !isNaN(n));
    if (!cfs.length) return;
    let npv = 0;
    cfs.forEach((cf, t) => { npv += cf / Math.pow(1 + rate, t); });
    const out = el.querySelector('#npvOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">Net Present Value</div>
      <div class="value" style="color:${npv >= 0 ? 'var(--success)' : 'var(--danger)'}">${fmt(npv)}</div>
      <div class="detail">${npv >= 0 ? 'Proyek layak' : 'Proyek tidak layak'} pada rate ${rate * 100}%</div>
    `;
  };
}

/* ========== LOAN / EMI ========== */
function renderLoan(el, play) {
  el.innerHTML = formHTML([
    { id: 'lnP', label: 'Pokok Pinjaman', placeholder: '100000000' },
    { id: 'lnR', label: 'Bunga per tahun (%)', placeholder: '10' },
    { id: 'lnN', label: 'Tenor (bulan)', placeholder: '60' }
  ], 'Hitung Angsuran') + `<div class="result-box" id="lnOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const P = +el.querySelector('#lnP').value;
    const r = +el.querySelector('#lnR').value / 100 / 12;
    const n = +el.querySelector('#lnN').value;
    if (!P || !n) return;
    const emi = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    const out = el.querySelector('#lnOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">Angsuran Bulanan (EMI)</div>
      <div class="value">${fmt(emi)}</div>
      <div class="detail">Total pembayaran: <strong>${fmt(total)}</strong><br>Total bunga: <strong>${fmt(total - P)}</strong></div>
    `;
  };
}

/* ========== COMPOUND ========== */
function renderCompound(el, play) {
  el.innerHTML = formHTML([
    { id: 'cpP', label: 'Modal Awal', placeholder: '10000000' },
    { id: 'cpR', label: 'Bunga per tahun (%)', placeholder: '6' },
    { id: 'cpT', label: 'Jangka waktu (tahun)', placeholder: '10' },
    { id: 'cpN', label: 'Frekuensi compounding / tahun', placeholder: '12' }
  ], 'Hitung') + `<div class="result-box" id="cpOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const P = +el.querySelector('#cpP').value;
    const r = +el.querySelector('#cpR').value / 100;
    const t = +el.querySelector('#cpT').value;
    const n = +el.querySelector('#cpN').value || 1;
    if (!P || !t) return;
    const A = P * Math.pow(1 + r / n, n * t);
    const out = el.querySelector('#cpOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">Nilai Akhir</div>
      <div class="value">${fmt(A)}</div>
      <div class="detail">Keuntungan: <strong>${fmt(A - P)}</strong></div>
    `;
  };
}

/* ========== ROI ========== */
function renderROI(el, play) {
  el.innerHTML = formHTML([
    { id: 'roiGain', label: 'Keuntungan / Net Profit', placeholder: '5000000' },
    { id: 'roiCost', label: 'Biaya Investasi', placeholder: '20000000' }
  ], 'Hitung ROI') + `<div class="result-box" id="roiOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const gain = +el.querySelector('#roiGain').value;
    const cost = +el.querySelector('#roiCost').value;
    if (!cost) return;
    const roi = (gain / cost) * 100;
    const out = el.querySelector('#roiOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">ROI</div>
      <div class="value">${roi.toFixed(2)}%</div>
    `;
  };
}

/* ========== BREAK EVEN ========== */
function renderBreakEven(el, play) {
  el.innerHTML = formHTML([
    { id: 'beFixed', label: 'Biaya Tetap', placeholder: '50000000' },
    { id: 'bePrice', label: 'Harga Jual / unit', placeholder: '150000' },
    { id: 'beVar', label: 'Biaya Variabel / unit', placeholder: '80000' }
  ], 'Hitung BEP') + `<div class="result-box" id="beOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const f = +el.querySelector('#beFixed').value;
    const p = +el.querySelector('#bePrice').value;
    const v = +el.querySelector('#beVar').value;
    if (!p || p <= v) return;
    const units = f / (p - v);
    const revenue = units * p;
    const out = el.querySelector('#beOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="label">Break-Even Point</div>
      <div class="value">${Math.ceil(units)} unit</div>
      <div class="detail">Revenue BEP: <strong>${fmt(revenue)}</strong></div>
    `;
  };
}

/* ========== MARGIN ========== */
function renderMargin(el, play) {
  el.innerHTML = formHTML([
    { id: 'mgCost', label: 'Harga Pokok / Cost', placeholder: '80000' },
    { id: 'mgPrice', label: 'Harga Jual', placeholder: '120000' }
  ], 'Hitung') + `<div class="result-box" id="mgOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const c = +el.querySelector('#mgCost').value;
    const p = +el.querySelector('#mgPrice').value;
    if (!c || !p) return;
    const margin = ((p - c) / p) * 100;
    const markup = ((p - c) / c) * 100;
    const out = el.querySelector('#mgOut');
    out.style.display = 'block';
    out.innerHTML = `
      <div class="detail">
        Margin: <strong>${margin.toFixed(2)}%</strong><br>
        Markup: <strong>${markup.toFixed(2)}%</strong><br>
        Profit: <strong>${fmt(p - c)}</strong>
      </div>
    `;
  };
}

/* ========== UNIT CONVERTER ========== */
function renderUnitConverter(el, play) {
  el.innerHTML = `
    <div class="form-group">
      <label>Tipe</label>
      <select id="ucType">
        <option value="length">Panjang</option>
        <option value="weight">Berat</option>
        <option value="temp">Suhu</option>
      </select>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Nilai</label><input id="ucVal" type="number" value="1"></div>
      <div class="form-group"><label>Dari</label><select id="ucFrom"></select></div>
    </div>
    <div class="form-group"><label>Ke</label><select id="ucTo"></select></div>
    <button class="btn-calc">Konversi</button>
    <div class="result-box" id="ucOut" style="display:none"></div>
  `;
  const units = {
    length: { m: 1, km: 0.001, cm: 100, mm: 1000, mi: 0.000621371, ft: 3.28084, in: 39.3701 },
    weight: { kg: 1, g: 1000, mg: 1e6, lb: 2.20462, oz: 35.274 },
    temp: { C: 'C', F: 'F', K: 'K' }
  };
  const typeSel = el.querySelector('#ucType');
  const fromSel = el.querySelector('#ucFrom');
  const toSel = el.querySelector('#ucTo');
  function fillUnits() {
    const t = typeSel.value;
    const opts = Object.keys(units[t]).map(u => `<option value="${u}">${u}</option>`).join('');
    fromSel.innerHTML = opts;
    toSel.innerHTML = opts;
    if (t === 'temp') { fromSel.value = 'C'; toSel.value = 'F'; }
  }
  fillUnits();
  typeSel.onchange = fillUnits;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const t = typeSel.value;
    const val = +el.querySelector('#ucVal').value;
    const from = fromSel.value;
    const to = toSel.value;
    let result;
    if (t === 'temp') {
      let c = val;
      if (from === 'F') c = (val - 32) * 5 / 9;
      if (from === 'K') c = val - 273.15;
      if (to === 'C') result = c;
      else if (to === 'F') result = c * 9 / 5 + 32;
      else result = c + 273.15;
    } else {
      const base = val / units[t][from];
      result = base * units[t][to];
    }
    const out = el.querySelector('#ucOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="value">${fmt(result)} ${to}</div>`;
  };
}

/* ========== DATE DIFF ========== */
function renderDateDiff(el, play) {
  el.innerHTML = formHTML([
    { id: 'dd1', label: 'Tanggal 1', type: 'date' },
    { id: 'dd2', label: 'Tanggal 2', type: 'date' }
  ], 'Hitung Selisih') + `<div class="result-box" id="ddOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const d1 = new Date(el.querySelector('#dd1').value);
    const d2 = new Date(el.querySelector('#dd2').value);
    if (isNaN(d1) || isNaN(d2)) return;
    const diff = Math.abs(d2 - d1) / 86400000;
    const out = el.querySelector('#ddOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">Selisih</div><div class="value">${Math.round(diff)} hari</div>`;
  };
}

/* ========== AGE ========== */
function renderAge(el, play) {
  el.innerHTML = formHTML([
    { id: 'ageBD', label: 'Tanggal Lahir', type: 'date' }
  ], 'Hitung Usia') + `<div class="result-box" id="ageOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const bd = new Date(el.querySelector('#ageBD').value);
    if (isNaN(bd)) return;
    const now = new Date();
    let y = now.getFullYear() - bd.getFullYear();
    let m = now.getMonth() - bd.getMonth();
    let d = now.getDate() - bd.getDate();
    if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    const out = el.querySelector('#ageOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="value">${y} tahun, ${m} bulan, ${d} hari</div>`;
  };
}

/* ========== HELPERS ========== */
function formHTML(fields, btnText) {
  return fields.map(f => {
    if (f.type === 'select') {
      return `<div class="form-group"><label>${f.label}</label>
        <select id="${f.id}">${f.options.map(([v,l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>`;
    }
    if (f.type === 'date') {
      return `<div class="form-group"><label>${f.label}</label><input type="date" id="${f.id}"></div>`;
    }
    return `<div class="form-group"><label>${f.label}</label>
      <input type="number" id="${f.id}" placeholder="${f.placeholder || ''}" step="any"></div>`;
  }).join('') + `<button class="btn-calc">${btnText}</button>`;
}

function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  if (Math.abs(n) >= 1e6 || (Math.abs(n) < 0.001 && n !== 0)) return n.toExponential(4);
  return Number(n.toPrecision(8)).toLocaleString('id-ID', { maximumFractionDigits: 6 });
}

function fmtOhm(r) {
  if (r >= 1e6) return (r / 1e6).toFixed(2) + ' MΩ';
  if (r >= 1e3) return (r / 1e3).toFixed(2) + ' kΩ';
  return r.toFixed(2) + ' Ω';
}

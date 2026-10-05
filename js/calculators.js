/**
 * Functional calculators for Silverhawk Kalkulator App
 */

export function renderCalculator(id, container, playClick) {
  const map = {
    basic: renderBasic, scientific: renderScientific, percentage: renderPercentage,
    bmi: renderBMI, egfr: renderEGFR, bmr: renderBMR, dosage: renderDosage,
    subnet: renderSubnet, ohm: renderOhm, 'led-resistor': renderLED,
    'resistor-color': renderResistorColor, 'voltage-divider': renderVoltageDivider,
    'rc-time': renderRC, 'gear-ratio': renderGearRatio, 'hp-torque': renderHPTorque,
    'fuel-economy': renderFuel, kinematics: renderKinematics, projectile: renderProjectile,
    'free-fall': renderFreeFall, 'delta-v': renderDeltaV, orbital: renderOrbital,
    npv: renderNPV, loan: renderLoan, compound: renderCompound, roi: renderROI,
    'break-even': renderBreakEven, 'percentage-business': renderMargin,
    'unit-converter': renderUnitConverter, 'date-diff': renderDateDiff, age: renderAge,
    fraction: renderFraction, random: renderRandom, average: renderAverage,
    bsa: renderBSA, ibw: renderIBW, pregnancy: renderPregnancy,
    'heart-rate': renderHeartRate, creatinine: renderCreatinine,
    'cidr-convert': renderCIDRConvert, bandwidth: renderBandwidth, binary: renderBinary,
    wildcard: renderWildcard, 'data-size': renderDataSize,
    'series-parallel': renderSeriesParallel, 'capacitor-energy': renderCapEnergy,
    'lc-resonance': renderLC, 'speed-rpm': renderSpeedRPM, 'tire-size': renderTireSize,
    compression: renderCompression, 'engine-disp': renderEngineDisp,
    force: renderForce, energy: renderEnergy, momentum: renderMomentum,
    'work-power': renderWorkPower, density: renderDensity, wave: renderWave,
    escape: renderEscape, hohmann: renderHohmann,
    'simple-interest': renderSimpleInterest, discount: renderDiscount,
    salary: renderSalary, inflation: renderInflation, 'cac-clv': renderCACCLV,
    concrete: renderConcrete, 'area-volume': renderAreaVolume,
    pythagoras: renderPythagoras, slope: renderSlope,
    // batch 2
    tip: renderTip, gpa: renderGPA, 'percentage-change': renderPctChange, ratio: renderRatio,
    quadratic: renderQuadratic, factorial: renderFactorial, 'log-solver': renderLogSolver,
    'matrix-2x2': renderMatrix, 'std-deviation': renderStdDev, complex: renderComplex,
    'angle-convert': renderAngle, prime: renderPrime, modulo: renderModulo,
    map: renderMAP, 'iv-drip': renderIVDrip, 'ideal-weight-range': renderIdealRange,
    'water-intake': renderWater,
    'ipv6-info': renderIPv6, 'port-check': renderPort, 'subnet-hosts': renderSubnetHosts,
    'mac-vendor': renderMAC, base64: renderBase64, 'url-encode': renderURL,
    transformer: renderTransformer, 'battery-life': renderBattery, 'pwm-duty': renderPWM,
    'opamp-gain': renderOpAmp,
    '0-100': render0100, 'power-weight': renderPwrWeight, 'fuel-cost': renderFuelCost,
    'gear-speed': renderGearSpeed, 'wheel-hp': renderWheelHP,
    pressure: renderPressure, 'ohms-physics': renderOhmsPhys, coulomb: renderCoulomb, snell: renderSnell,
    'orbital-vel': renderOrbVel, synodic: renderSynodic, 'rocket-mass': renderRocketMass,
    'light-time': renderLightTime, schwarzschild: renderSchwarz, kepler3: renderKepler3,
    mortgage: renderMortgage, payback: renderPayback, cagr: renderCAGR, 'markup-price': renderMarkupPrice,
    'beam-deflect': renderBeam, 'torque-tech': renderTorqueTech, 'rpm-to-rad': renderRPMrad,
    'heat-transfer': renderHeat, reynold: renderReynold, 'bolt-torque': renderBolt,
    'unit-pressure': renderUnitPressure, 'steel-weight': renderSteel
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


/* ========== NEW CALCULATORS ========== */
function renderFraction(el, play) {
  el.innerHTML = formHTML([
    { id: 'frN1', label: 'Pembilang 1', placeholder: '1' },
    { id: 'frD1', label: 'Penyebut 1', placeholder: '2' },
    { id: 'frOp', label: 'Operasi', type: 'select', options: [['+','+'],['-','−'],['*','×'],['/','÷']] },
    { id: 'frN2', label: 'Pembilang 2', placeholder: '1' },
    { id: 'frD2', label: 'Penyebut 2', placeholder: '3' }
  ], 'Hitung') + `<div class="result-box" id="frOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const n1 = +el.querySelector('#frN1').value, d1 = +el.querySelector('#frD1').value;
    const n2 = +el.querySelector('#frN2').value, d2 = +el.querySelector('#frD2').value;
    const op = el.querySelector('#frOp').value;
    if (!d1 || !d2) return;
    let rn, rd;
    if (op === '+') { rn = n1*d2 + n2*d1; rd = d1*d2; }
    else if (op === '-') { rn = n1*d2 - n2*d1; rd = d1*d2; }
    else if (op === '*') { rn = n1*n2; rd = d1*d2; }
    else { rn = n1*d2; rd = d1*n2; }
    const g = gcd(Math.abs(rn), Math.abs(rd));
    rn /= g; rd /= g;
    const out = el.querySelector('#frOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="value">${rn}/${rd}</div><div class="detail">≈ ${fmt(rn/rd)}</div>`;
  };
  function gcd(a,b){ return b ? gcd(b, a%b) : a; }
}

function renderRandom(el, play) {
  el.innerHTML = formHTML([
    { id: 'rnMin', label: 'Minimum', placeholder: '1' },
    { id: 'rnMax', label: 'Maximum', placeholder: '100' },
    { id: 'rnCount', label: 'Jumlah angka', placeholder: '1' }
  ], 'Generate') + `<div class="result-box" id="rnOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const min = +el.querySelector('#rnMin').value;
    const max = +el.querySelector('#rnMax').value;
    const count = Math.min(+el.querySelector('#rnCount').value || 1, 50);
    if (min > max) return;
    const nums = Array.from({length: count}, () => Math.floor(Math.random() * (max - min + 1)) + min);
    const out = el.querySelector('#rnOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="value" style="font-size:1.2rem;word-break:break-all">${nums.join(', ')}</div>`;
  };
}

function renderAverage(el, play) {
  el.innerHTML = formHTML([
    { id: 'avData', label: 'Data (pisahkan koma)', placeholder: '10,20,30,40,50' }
  ], 'Hitung') + `<div class="result-box" id="avOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const arr = el.querySelector('#avData').value.split(',').map(s => +s.trim()).filter(n => !isNaN(n));
    if (!arr.length) return;
    const n = arr.length;
    const mean = arr.reduce((a,b) => a+b, 0) / n;
    const sorted = [...arr].sort((a,b) => a-b);
    const med = n % 2 ? sorted[Math.floor(n/2)] : (sorted[n/2-1] + sorted[n/2]) / 2;
    const variance = arr.reduce((a,b) => a + (b-mean)**2, 0) / n;
    const sd = Math.sqrt(variance);
    const out = el.querySelector('#avOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">Mean: <strong>${fmt(mean)}</strong><br>Median: <strong>${fmt(med)}</strong><br>Std Dev: <strong>${fmt(sd)}</strong><br>Min: ${fmt(Math.min(...arr))} · Max: ${fmt(Math.max(...arr))}</div>`;
  };
}

function renderBSA(el, play) {
  el.innerHTML = formHTML([
    { id: 'bsaH', label: 'Tinggi (cm)', placeholder: '170' },
    { id: 'bsaW', label: 'Berat (kg)', placeholder: '70' }
  ], 'Hitung BSA') + `<div class="result-box" id="bsaOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const h = +el.querySelector('#bsaH').value, w = +el.querySelector('#bsaW').value;
    if (!h || !w) return;
    const bsa = Math.sqrt(h * w / 3600);
    const out = el.querySelector('#bsaOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">BSA (Mosteller)</div><div class="value">${bsa.toFixed(3)} m²</div>`;
  };
}

function renderIBW(el, play) {
  el.innerHTML = formHTML([
    { id: 'ibwH', label: 'Tinggi (cm)', placeholder: '170' },
    { id: 'ibwSex', label: 'Jenis Kelamin', type: 'select', options: [['m','Laki-laki'],['f','Perempuan']] }
  ], 'Hitung IBW') + `<div class="result-box" id="ibwOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const h = +el.querySelector('#ibwH').value;
    const sex = el.querySelector('#ibwSex').value;
    if (!h) return;
    const inches = h / 2.54;
    const ibw = sex === 'm' ? 50 + 2.3 * (inches - 60) : 45.5 + 2.3 * (inches - 60);
    const out = el.querySelector('#ibwOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">Ideal Body Weight</div><div class="value">${fmt(ibw)} kg</div>`;
  };
}

function renderPregnancy(el, play) {
  el.innerHTML = formHTML([
    { id: 'prLMP', label: 'Hari Pertama Haid Terakhir (LMP)', type: 'date' }
  ], 'Hitung') + `<div class="result-box" id="prOut2" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const lmp = new Date(el.querySelector('#prLMP').value);
    if (isNaN(lmp)) return;
    const due = new Date(lmp); due.setDate(due.getDate() + 280);
    const now = new Date();
    const days = Math.floor((now - lmp) / 86400000);
    const weeks = Math.floor(days / 7);
    const rem = days % 7;
    const out = el.querySelector('#prOut2');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">Usia kehamilan: <strong>${weeks} minggu ${rem} hari</strong><br>Perkiraan lahir (EDD): <strong>${due.toLocaleDateString('id-ID')}</strong></div>`;
  };
}

function renderHeartRate(el, play) {
  el.innerHTML = formHTML([
    { id: 'hrAge', label: 'Usia', placeholder: '30' },
    { id: 'hrRest', label: 'Denyut istirahat (opsional)', placeholder: '70' }
  ], 'Hitung Zona') + `<div class="result-box" id="hrOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const age = +el.querySelector('#hrAge').value;
    const rest = +el.querySelector('#hrRest').value || 60;
    if (!age) return;
    const max = 220 - age;
    const out = el.querySelector('#hrOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">
      Max HR: <strong>${max} bpm</strong><br>
      Zona Fat Burn (50-70%): <strong>${Math.round(max*0.5)}–${Math.round(max*0.7)}</strong><br>
      Zona Cardio (70-85%): <strong>${Math.round(max*0.7)}–${Math.round(max*0.85)}</strong><br>
      Zona Peak (85-95%): <strong>${Math.round(max*0.85)}–${Math.round(max*0.95)}</strong>
    </div>`;
  };
}

function renderCreatinine(el, play) {
  el.innerHTML = formHTML([
    { id: 'crAge', label: 'Usia', placeholder: '45' },
    { id: 'crSex', label: 'Jenis Kelamin', type: 'select', options: [['m','Laki-laki'],['f','Perempuan']] },
    { id: 'crW', label: 'Berat (kg)', placeholder: '70' },
    { id: 'crScr', label: 'Serum Creatinine (mg/dL)', placeholder: '1.0' }
  ], 'Hitung CrCl') + `<div class="result-box" id="crOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const age = +el.querySelector('#crAge').value, sex = el.querySelector('#crSex').value;
    const w = +el.querySelector('#crW').value, scr = +el.querySelector('#crScr').value;
    if (!age || !w || !scr) return;
    let crcl = ((140 - age) * w) / (72 * scr);
    if (sex === 'f') crcl *= 0.85;
    const out = el.querySelector('#crOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">Creatinine Clearance</div><div class="value">${fmt(crcl)} mL/min</div>`;
  };
}

function renderCIDRConvert(el, play) {
  el.innerHTML = formHTML([
    { id: 'ccCIDR', label: 'CIDR Prefix (0-32)', placeholder: '24' }
  ], 'Konversi') + `<div class="result-box" id="ccOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const cidr = +el.querySelector('#ccCIDR').value;
    if (cidr < 0 || cidr > 32) return;
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const str = [24,16,8,0].map(s => (mask >>> s) & 255).join('.');
    const hosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : 2**(32-cidr) - 2;
    const out = el.querySelector('#ccOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">Subnet Mask: <strong>${str}</strong><br>Wildcard: <strong>${[24,16,8,0].map(s => (~mask >>> s) & 255).join('.')}</strong><br>Usable Hosts: <strong>${hosts}</strong></div>`;
  };
}

function renderBandwidth(el, play) {
  el.innerHTML = formHTML([
    { id: 'bwUsers', label: 'Jumlah user simultan', placeholder: '50' },
    { id: 'bwPer', label: 'Bandwidth per user (Mbps)', placeholder: '2' },
    { id: 'bwOver', label: 'Oversubscription ratio', placeholder: '4' }
  ], 'Hitung') + `<div class="result-box" id="bwOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const users = +el.querySelector('#bwUsers').value;
    const per = +el.querySelector('#bwPer').value;
    const over = +el.querySelector('#bwOver').value || 1;
    if (!users || !per) return;
    const total = (users * per) / over;
    const out = el.querySelector('#bwOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">Bandwidth dibutuhkan</div><div class="value">${fmt(total)} Mbps</div>`;
  };
}

function renderBinary(el, play) {
  el.innerHTML = formHTML([
    { id: 'binVal', label: 'Nilai', placeholder: '255' },
    { id: 'binFrom', label: 'Dari', type: 'select', options: [['dec','Decimal'],['bin','Binary'],['hex','Hex']] }
  ], 'Konversi') + `<div class="result-box" id="binOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const val = el.querySelector('#binVal').value.trim();
    const from = el.querySelector('#binFrom').value;
    let n;
    try {
      if (from === 'dec') n = parseInt(val, 10);
      else if (from === 'bin') n = parseInt(val, 2);
      else n = parseInt(val, 16);
      if (isNaN(n)) throw 0;
    } catch { return; }
    const out = el.querySelector('#binOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">Decimal: <strong>${n}</strong><br>Binary: <strong>${n.toString(2)}</strong><br>Hex: <strong>${n.toString(16).toUpperCase()}</strong></div>`;
  };
}

function renderWildcard(el, play) {
  el.innerHTML = formHTML([
    { id: 'wcCIDR', label: 'CIDR / Prefix', placeholder: '24' }
  ], 'Hitung Wildcard') + `<div class="result-box" id="wcOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const cidr = +el.querySelector('#wcCIDR').value;
    if (cidr < 0 || cidr > 32) return;
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const wild = (~mask) >>> 0;
    const str = [24,16,8,0].map(s => (wild >>> s) & 255).join('.');
    const out = el.querySelector('#wcOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="value">${str}</div>`;
  };
}

function renderDataSize(el, play) {
  el.innerHTML = formHTML([
    { id: 'dsVal', label: 'Nilai', placeholder: '1' },
    { id: 'dsFrom', label: 'Dari', type: 'select', options: [['B','Byte'],['KB','KB'],['MB','MB'],['GB','GB'],['TB','TB']] },
    { id: 'dsTo', label: 'Ke', type: 'select', options: [['B','Byte'],['KB','KB'],['MB','MB'],['GB','GB'],['TB','TB']] }
  ], 'Konversi') + `<div class="result-box" id="dsOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const factors = { B:1, KB:1024, MB:1024**2, GB:1024**3, TB:1024**4 };
    const val = +el.querySelector('#dsVal').value;
    const from = el.querySelector('#dsFrom').value;
    const to = el.querySelector('#dsTo').value;
    const result = val * factors[from] / factors[to];
    const out = el.querySelector('#dsOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="value">${fmt(result)} ${to}</div>`;
  };
}

function renderSeriesParallel(el, play) {
  el.innerHTML = formHTML([
    { id: 'spVals', label: 'Nilai resistor (Ω, pisahkan koma)', placeholder: '100,220,330' },
    { id: 'spType', label: 'Susunan', type: 'select', options: [['series','Seri'],['parallel','Paralel']] }
  ], 'Hitung') + `<div class="result-box" id="spOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const vals = el.querySelector('#spVals').value.split(',').map(s => +s.trim()).filter(n => n > 0);
    const type = el.querySelector('#spType').value;
    if (!vals.length) return;
    let r;
    if (type === 'series') r = vals.reduce((a,b) => a+b, 0);
    else r = 1 / vals.reduce((a,b) => a + 1/b, 0);
    const out = el.querySelector('#spOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">R total</div><div class="value">${fmtOhm(r)}</div>`;
  };
}

function renderCapEnergy(el, play) {
  el.innerHTML = formHTML([
    { id: 'ceC', label: 'Kapasitansi (µF)', placeholder: '100' },
    { id: 'ceV', label: 'Tegangan (V)', placeholder: '12' }
  ], 'Hitung') + `<div class="result-box" id="ceOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const c = +el.querySelector('#ceC').value * 1e-6;
    const v = +el.querySelector('#ceV').value;
    if (!c || !v) return;
    const e = 0.5 * c * v * v;
    const out = el.querySelector('#ceOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">Energi</div><div class="value">${fmt(e)} J</div><div class="detail">${fmt(e*1000)} mJ</div>`;
  };
}

function renderLC(el, play) {
  el.innerHTML = formHTML([
    { id: 'lcL', label: 'Induktansi L (mH)', placeholder: '10' },
    { id: 'lcC', label: 'Kapasitansi C (µF)', placeholder: '100' }
  ], 'Hitung f₀') + `<div class="result-box" id="lcOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const L = +el.querySelector('#lcL').value * 1e-3;
    const C = +el.querySelector('#lcC').value * 1e-6;
    if (!L || !C) return;
    const f = 1 / (2 * Math.PI * Math.sqrt(L * C));
    const out = el.querySelector('#lcOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">Frekuensi Resonansi</div><div class="value">${fmt(f)} Hz</div>`;
  };
}

function renderSpeedRPM(el, play) {
  el.innerHTML = formHTML([
    { id: 'srRPM', label: 'RPM mesin', placeholder: '3000' },
    { id: 'srGear', label: 'Gear ratio (transmisi × final)', placeholder: '4.0' },
    { id: 'srTire', label: 'Diameter ban (inch)', placeholder: '25' }
  ], 'Hitung Speed') + `<div class="result-box" id="srOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const rpm = +el.querySelector('#srRPM').value;
    const gear = +el.querySelector('#srGear').value;
    const tire = +el.querySelector('#srTire').value;
    if (!rpm || !gear || !tire) return;
    const mph = (rpm * tire) / (gear * 336);
    const kph = mph * 1.60934;
    const out = el.querySelector('#srOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="value">${fmt(kph)} km/h</div><div class="detail">${fmt(mph)} mph</div>`;
  };
}

function renderTireSize(el, play) {
  el.innerHTML = formHTML([
    { id: 'tsW', label: 'Lebar (mm)', placeholder: '205' },
    { id: 'tsAR', label: 'Aspect Ratio (%)', placeholder: '55' },
    { id: 'tsR', label: 'Rim (inch)', placeholder: '16' }
  ], 'Hitung') + `<div class="result-box" id="tsOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const w = +el.querySelector('#tsW').value;
    const ar = +el.querySelector('#tsAR').value;
    const r = +el.querySelector('#tsR').value;
    if (!w || !ar || !r) return;
    const sidewall = w * (ar/100);
    const diam = (sidewall * 2 / 25.4) + r;
    const circ = diam * Math.PI;
    const out = el.querySelector('#tsOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">Diameter: <strong>${fmt(diam)} inch</strong> (${fmt(diam*25.4)} mm)<br>Circumference: <strong>${fmt(circ)} inch</strong><br>Revs/mile: <strong>${fmt(63360/circ)}</strong></div>`;
  };
}

function renderCompression(el, play) {
  el.innerHTML = formHTML([
    { id: 'crVd', label: 'Displacement volume (cc)', placeholder: '500' },
    { id: 'crVc', label: 'Clearance volume (cc)', placeholder: '50' }
  ], 'Hitung CR') + `<div class="result-box" id="cr2Out" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const vd = +el.querySelector('#crVd').value;
    const vc = +el.querySelector('#crVc').value;
    if (!vd || !vc) return;
    const cr = (vd + vc) / vc;
    const out = el.querySelector('#cr2Out');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">Compression Ratio</div><div class="value">${cr.toFixed(2)} : 1</div>`;
  };
}

function renderEngineDisp(el, play) {
  el.innerHTML = formHTML([
    { id: 'edBore', label: 'Bore (mm)', placeholder: '86' },
    { id: 'edStroke', label: 'Stroke (mm)', placeholder: '86' },
    { id: 'edCyl', label: 'Jumlah silinder', placeholder: '4' }
  ], 'Hitung') + `<div class="result-box" id="edOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const bore = +el.querySelector('#edBore').value;
    const stroke = +el.querySelector('#edStroke').value;
    const cyl = +el.querySelector('#edCyl').value;
    if (!bore || !stroke || !cyl) return;
    const cc = Math.PI * (bore/2)**2 * stroke * cyl / 1000;
    const out = el.querySelector('#edOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">Displacement</div><div class="value">${fmt(cc)} cc</div><div class="detail">${fmt(cc/1000)} L</div>`;
  };
}

function renderForce(el, play) {
  el.innerHTML = formHTML([
    { id: 'foM', label: 'Massa (kg)', placeholder: '10' },
    { id: 'foA', label: 'Percepatan (m/s²)', placeholder: '9.81' }
  ], 'Hitung F') + `<div class="result-box" id="foOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const m = +el.querySelector('#foM').value, a = +el.querySelector('#foA').value;
    if (!m || a === undefined) return;
    const out = el.querySelector('#foOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="value">${fmt(m*a)} N</div>`;
  };
}

function renderEnergy(el, play) {
  el.innerHTML = formHTML([
    { id: 'enM', label: 'Massa (kg)', placeholder: '10' },
    { id: 'enV', label: 'Kecepatan (m/s)', placeholder: '5' },
    { id: 'enH', label: 'Ketinggian (m)', placeholder: '10' }
  ], 'Hitung') + `<div class="result-box" id="enOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const m = +el.querySelector('#enM').value, v = +el.querySelector('#enV').value, h = +el.querySelector('#enH').value;
    const ke = 0.5 * m * v * v;
    const pe = m * 9.81 * h;
    const out = el.querySelector('#enOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">Kinetic: <strong>${fmt(ke)} J</strong><br>Potential: <strong>${fmt(pe)} J</strong><br>Total: <strong>${fmt(ke+pe)} J</strong></div>`;
  };
}

function renderMomentum(el, play) {
  el.innerHTML = formHTML([
    { id: 'moM', label: 'Massa (kg)', placeholder: '5' },
    { id: 'moV', label: 'Kecepatan (m/s)', placeholder: '10' }
  ], 'Hitung p') + `<div class="result-box" id="moOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const m = +el.querySelector('#moM').value, v = +el.querySelector('#moV').value;
    const out = el.querySelector('#moOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="value">${fmt(m*v)} kg·m/s</div>`;
  };
}

function renderWorkPower(el, play) {
  el.innerHTML = formHTML([
    { id: 'wpF', label: 'Gaya (N)', placeholder: '100' },
    { id: 'wpD', label: 'Jarak (m)', placeholder: '5' },
    { id: 'wpT', label: 'Waktu (s)', placeholder: '10' }
  ], 'Hitung') + `<div class="result-box" id="wpOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const f = +el.querySelector('#wpF').value, d = +el.querySelector('#wpD').value, t = +el.querySelector('#wpT').value;
    const work = f * d;
    const power = t ? work / t : 0;
    const out = el.querySelector('#wpOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">Work: <strong>${fmt(work)} J</strong><br>Power: <strong>${fmt(power)} W</strong></div>`;
  };
}

function renderDensity(el, play) {
  el.innerHTML = formHTML([
    { id: 'deM', label: 'Massa (kg)', placeholder: '1' },
    { id: 'deV', label: 'Volume (m³)', placeholder: '0.001' }
  ], 'Hitung ρ') + `<div class="result-box" id="deOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const m = +el.querySelector('#deM').value, v = +el.querySelector('#deV').value;
    if (!v) return;
    const out = el.querySelector('#deOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="value">${fmt(m/v)} kg/m³</div>`;
  };
}

function renderWave(el, play) {
  el.innerHTML = formHTML([
    { id: 'wvF', label: 'Frekuensi (Hz)', placeholder: '440' },
    { id: 'wvL', label: 'Panjang gelombang (m)', placeholder: '0.78' }
  ], 'Hitung v') + `<div class="result-box" id="wvOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const f = +el.querySelector('#wvF').value, l = +el.querySelector('#wvL').value;
    const out = el.querySelector('#wvOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="value">${fmt(f*l)} m/s</div>`;
  };
}

function renderEscape(el, play) {
  el.innerHTML = formHTML([
    { id: 'esM', label: 'Massa benda langit (kg)', placeholder: '5.972e24' },
    { id: 'esR', label: 'Radius (m)', placeholder: '6.371e6' }
  ], 'Hitung') + `<div class="result-box" id="esOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const M = +el.querySelector('#esM').value, R = +el.querySelector('#esR').value;
    if (!M || !R) return;
    const G = 6.67430e-11;
    const v = Math.sqrt(2 * G * M / R);
    const out = el.querySelector('#esOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="value">${fmt(v)} m/s</div><div class="detail">${fmt(v/1000)} km/s</div>`;
  };
}

function renderHohmann(el, play) {
  el.innerHTML = formHTML([
    { id: 'hoR1', label: 'Radius orbit awal (km)', placeholder: '6771' },
    { id: 'hoR2', label: 'Radius orbit target (km)', placeholder: '42164' },
    { id: 'hoMu', label: 'μ (km³/s²)', placeholder: '398600' }
  ], 'Hitung Δv') + `<div class="result-box" id="hoOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const r1 = +el.querySelector('#hoR1').value;
    const r2 = +el.querySelector('#hoR2').value;
    const mu = +el.querySelector('#hoMu').value;
    if (!r1 || !r2 || !mu) return;
    const a = (r1 + r2) / 2;
    const v1 = Math.sqrt(mu / r1);
    const v2 = Math.sqrt(mu / r2);
    const vt1 = Math.sqrt(mu * (2/r1 - 1/a));
    const vt2 = Math.sqrt(mu * (2/r2 - 1/a));
    const dv1 = Math.abs(vt1 - v1);
    const dv2 = Math.abs(v2 - vt2);
    const out = el.querySelector('#hoOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">Δv₁: <strong>${fmt(dv1)} km/s</strong><br>Δv₂: <strong>${fmt(dv2)} km/s</strong><br>Total: <strong>${fmt(dv1+dv2)} km/s</strong></div>`;
  };
}

function renderSimpleInterest(el, play) {
  el.innerHTML = formHTML([
    { id: 'siP', label: 'Pokok', placeholder: '10000000' },
    { id: 'siR', label: 'Bunga / tahun (%)', placeholder: '5' },
    { id: 'siT', label: 'Waktu (tahun)', placeholder: '3' }
  ], 'Hitung') + `<div class="result-box" id="siOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const P = +el.querySelector('#siP').value, r = +el.querySelector('#siR').value/100, t = +el.querySelector('#siT').value;
    const I = P * r * t;
    const out = el.querySelector('#siOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">Bunga: <strong>${fmt(I)}</strong><br>Total: <strong>${fmt(P+I)}</strong></div>`;
  };
}

function renderDiscount(el, play) {
  el.innerHTML = formHTML([
    { id: 'diPrice', label: 'Harga asli', placeholder: '150000' },
    { id: 'diPct', label: 'Diskon (%)', placeholder: '20' }
  ], 'Hitung') + `<div class="result-box" id="diOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const p = +el.querySelector('#diPrice').value, d = +el.querySelector('#diPct').value;
    const save = p * d / 100;
    const out = el.querySelector('#diOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">Hemat: <strong>${fmt(save)}</strong><br>Harga akhir: <strong>${fmt(p-save)}</strong></div>`;
  };
}

function renderSalary(el, play) {
  el.innerHTML = formHTML([
    { id: 'saGross', label: 'Gaji kotor / bulan', placeholder: '10000000' },
    { id: 'saTax', label: 'Pajak & potongan (%)', placeholder: '10' }
  ], 'Hitung') + `<div class="result-box" id="saOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const g = +el.querySelector('#saGross').value, t = +el.querySelector('#saTax').value;
    const net = g * (1 - t/100);
    const out = el.querySelector('#saOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="label">Gaji bersih (est)</div><div class="value">${fmt(net)}</div>`;
  };
}

function renderInflation(el, play) {
  el.innerHTML = formHTML([
    { id: 'inAmt', label: 'Nilai sekarang', placeholder: '10000000' },
    { id: 'inRate', label: 'Inflasi / tahun (%)', placeholder: '3' },
    { id: 'inYears', label: 'Tahun ke depan', placeholder: '10' }
  ], 'Hitung') + `<div class="result-box" id="inOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const amt = +el.querySelector('#inAmt').value, rate = +el.querySelector('#inRate').value/100, y = +el.querySelector('#inYears').value;
    const future = amt * Math.pow(1+rate, y);
    const purchasing = amt / Math.pow(1+rate, y);
    const out = el.querySelector('#inOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">Nilai setara masa depan: <strong>${fmt(future)}</strong><br>Daya beli ${y} thn lagi: <strong>${fmt(purchasing)}</strong></div>`;
  };
}

function renderCACCLV(el, play) {
  el.innerHTML = formHTML([
    { id: 'ccSpend', label: 'Total marketing spend', placeholder: '50000000' },
    { id: 'ccCust', label: 'Pelanggan baru', placeholder: '200' },
    { id: 'ccARPU', label: 'ARPU / bulan', placeholder: '150000' },
    { id: 'ccMonths', label: 'Rata-rata bulan berlangganan', placeholder: '24' }
  ], 'Hitung') + `<div class="result-box" id="ccOut2" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const spend = +el.querySelector('#ccSpend').value, cust = +el.querySelector('#ccCust').value;
    const arpu = +el.querySelector('#ccARPU').value, months = +el.querySelector('#ccMonths').value;
    if (!cust) return;
    const cac = spend / cust;
    const clv = arpu * months;
    const out = el.querySelector('#ccOut2');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">CAC: <strong>${fmt(cac)}</strong><br>CLV: <strong>${fmt(clv)}</strong><br>CLV:CAC = <strong>${fmt(clv/cac)}</strong></div>`;
  };
}

function renderConcrete(el, play) {
  el.innerHTML = formHTML([
    { id: 'coL', label: 'Panjang (m)', placeholder: '5' },
    { id: 'coW', label: 'Lebar (m)', placeholder: '4' },
    { id: 'coH', label: 'Tebal (m)', placeholder: '0.12' }
  ], 'Hitung Volume') + `<div class="result-box" id="coOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const l = +el.querySelector('#coL').value, w = +el.querySelector('#coW').value, h = +el.querySelector('#coH').value;
    const vol = l * w * h;
    const out = el.querySelector('#coOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="value">${fmt(vol)} m³</div><div class="detail">≈ ${fmt(vol*1.05)} m³ (dengan waste 5%)</div>`;
  };
}

function renderAreaVolume(el, play) {
  el.innerHTML = formHTML([
    { id: 'avShape', label: 'Bangun', type: 'select', options: [['rect','Persegi panjang'],['circle','Lingkaran'],['box','Balok'],['cyl','Silinder']] },
    { id: 'avA', label: 'a / panjang / jari-jari (m)', placeholder: '5' },
    { id: 'avB', label: 'b / lebar / tinggi (m)', placeholder: '3' },
    { id: 'avC', label: 'c / tinggi (balok, m)', placeholder: '2' }
  ], 'Hitung') + `<div class="result-box" id="avOut2" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const shape = el.querySelector('#avShape').value;
    const a = +el.querySelector('#avA').value, b = +el.querySelector('#avB').value, c = +el.querySelector('#avC').value;
    let result = '';
    if (shape === 'rect') result = `Luas: <strong>${fmt(a*b)} m²</strong>`;
    else if (shape === 'circle') result = `Luas: <strong>${fmt(Math.PI*a*a)} m²</strong><br>Keliling: <strong>${fmt(2*Math.PI*a)} m</strong>`;
    else if (shape === 'box') result = `Volume: <strong>${fmt(a*b*c)} m³</strong><br>Luas permukaan: <strong>${fmt(2*(a*b+b*c+a*c))} m²</strong>`;
    else result = `Volume: <strong>${fmt(Math.PI*a*a*b)} m³</strong><br>Luas selimut: <strong>${fmt(2*Math.PI*a*b)} m²</strong>`;
    const out = el.querySelector('#avOut2');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">${result}</div>`;
  };
}

function renderPythagoras(el, play) {
  el.innerHTML = formHTML([
    { id: 'pyA', label: 'Sisi a', placeholder: '3' },
    { id: 'pyB', label: 'Sisi b', placeholder: '4' }
  ], 'Hitung sisi miring') + `<div class="result-box" id="pyOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const a = +el.querySelector('#pyA').value, b = +el.querySelector('#pyB').value;
    const c = Math.sqrt(a*a + b*b);
    const out = el.querySelector('#pyOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="value">${fmt(c)}</div>`;
  };
}

function renderSlope(el, play) {
  el.innerHTML = formHTML([
    { id: 'slRise', label: 'Rise (vertikal)', placeholder: '3' },
    { id: 'slRun', label: 'Run (horizontal)', placeholder: '10' }
  ], 'Hitung Slope') + `<div class="result-box" id="slOut" style="display:none"></div>`;
  el.querySelector('.btn-calc').onclick = () => {
    play();
    const rise = +el.querySelector('#slRise').value, run = +el.querySelector('#slRun').value;
    if (!run) return;
    const slope = rise / run;
    const angle = Math.atan(slope) * 180 / Math.PI;
    const pct = slope * 100;
    const out = el.querySelector('#slOut');
    out.style.display = 'block';
    out.innerHTML = `<div class="detail">Slope: <strong>${fmt(slope)}</strong><br>Angle: <strong>${fmt(angle)}°</strong><br>Grade: <strong>${fmt(pct)}%</strong></div>`;
  };
}



/* ========== BATCH 2 ========== */
function renderTip(el,play){el.innerHTML=formHTML([{id:'tpBill',label:'Total tagihan',placeholder:'250000'},{id:'tpPct',label:'Tip (%)',placeholder:'10'}],'Hitung')+`<div class="result-box" id="tpOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const b=+el.querySelector('#tpBill').value,p=+el.querySelector('#tpPct').value;const tip=b*p/100;const out=el.querySelector('#tpOut');out.style.display='block';out.innerHTML=`<div class="detail">Tip: <strong>${fmt(tip)}</strong><br>Total bayar: <strong>${fmt(b+tip)}</strong></div>`;};}

function renderGPA(el,play){el.innerHTML=`<div class="form-group"><label>Nilai & SKS (contoh: A:3, B:2, A:4)</label><input id="gpaIn" placeholder="A:3, B:2, A:4"></div><button class="btn-calc">Hitung IPK</button><div class="result-box" id="gpaOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const map={A:4,B:3,C:2,D:1,E:0,'A-':3.7,'B+':3.3};const parts=el.querySelector('#gpaIn').value.split(',').map(s=>s.trim());let pts=0,sks=0;for(const p of parts){const [g,s]=p.split(':');const sc=+s;if(!sc||!(g in map||g.toUpperCase() in map))continue;pts+=(map[g]||map[g.toUpperCase()])*sc;sks+=sc;}if(!sks)return;const out=el.querySelector('#gpaOut');out.style.display='block';out.innerHTML=`<div class="value">${(pts/sks).toFixed(2)}</div><div class="detail">Total SKS: ${sks}</div>`;};}

function renderPctChange(el,play){el.innerHTML=formHTML([{id:'pcOld',label:'Nilai lama',placeholder:'100'},{id:'pcNew',label:'Nilai baru',placeholder:'120'}],'Hitung')+`<div class="result-box" id="pcOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const o=+el.querySelector('#pcOld').value,n=+el.querySelector('#pcNew').value;if(!o)return;const pct=((n-o)/o)*100;const out=el.querySelector('#pcOut');out.style.display='block';out.innerHTML=`<div class="value">${pct>=0?'+':''}${pct.toFixed(2)}%</div>`;};}

function renderRatio(el,play){el.innerHTML=formHTML([{id:'raA',label:'a',placeholder:'2'},{id:'raB',label:'b',placeholder:'4'}],'Sederhanakan')+`<div class="result-box" id="raOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();let a=+el.querySelector('#raA').value,b=+el.querySelector('#raB').value;const g=(x,y)=>y?g(y,x%y):x;const d=g(Math.abs(a),Math.abs(b));const out=el.querySelector('#raOut');out.style.display='block';out.innerHTML=`<div class="value">${a/d} : ${b/d}</div>`;};}

function renderQuadratic(el,play){el.innerHTML=formHTML([{id:'qaA',label:'a',placeholder:'1'},{id:'qaB',label:'b',placeholder:'-5'},{id:'qaC',label:'c',placeholder:'6'}],'Hitung akar')+`<div class="result-box" id="qaOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const a=+el.querySelector('#qaA').value,b=+el.querySelector('#qaB').value,c=+el.querySelector('#qaC').value;const d=b*b-4*a*c;let res;if(d<0)res='Akar kompleks / tidak real';else if(d===0)res=`x = ${fmt(-b/(2*a))}`;else res=`x₁ = ${fmt((-b+Math.sqrt(d))/(2*a))}<br>x₂ = ${fmt((-b-Math.sqrt(d))/(2*a))}`;const out=el.querySelector('#qaOut');out.style.display='block';out.innerHTML=`<div class="detail">${res}<br>Diskriminan: ${fmt(d)}</div>`;};}

function renderFactorial(el,play){el.innerHTML=formHTML([{id:'faN',label:'n',placeholder:'5'},{id:'faR',label:'r (untuk nPr/nCr)',placeholder:'2'}],'Hitung')+`<div class="result-box" id="faOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const n=+el.querySelector('#faN').value,r=+el.querySelector('#faR').value;const fact=x=>{let p=1;for(let i=2;i<=x;i++)p*=i;return p;};const nf=fact(n);let pr=1,cr=1;if(r>=0&&r<=n){pr=fact(n)/fact(n-r);cr=pr/fact(r);}const out=el.querySelector('#faOut');out.style.display='block';out.innerHTML=`<div class="detail">n! = <strong>${fmt(nf)}</strong><br>nPr = <strong>${fmt(pr)}</strong><br>nCr = <strong>${fmt(cr)}</strong></div>`;};}

function renderLogSolver(el,play){el.innerHTML=formHTML([{id:'lgBase',label:'Base (b)',placeholder:'10'},{id:'lgArg',label:'Argument (a)',placeholder:'100'}],'Hitung log')+`<div class="result-box" id="lgOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const b=+el.querySelector('#lgBase').value,a=+el.querySelector('#lgArg').value;if(b<=0||b===1||a<=0)return;const out=el.querySelector('#lgOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(Math.log(a)/Math.log(b))}</div>`;};}

function renderMatrix(el,play){el.innerHTML=`<p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.5rem">Matrix 2×2: [a b; c d]</p>${formHTML([{id:'mA',label:'a',placeholder:'1'},{id:'mB',label:'b',placeholder:'2'},{id:'mC',label:'c',placeholder:'3'},{id:'mD',label:'d',placeholder:'4'}],'Hitung')}<div class="result-box" id="mOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const a=+el.querySelector('#mA').value,b=+el.querySelector('#mB').value,c=+el.querySelector('#mC').value,d=+el.querySelector('#mD').value;const det=a*d-b*c;const out=el.querySelector('#mOut');out.style.display='block';out.innerHTML=`<div class="detail">Det = <strong>${fmt(det)}</strong>${det?`<br>Invers: [${fmt(d/det)} ${fmt(-b/det)}; ${fmt(-c/det)} ${fmt(a/det)}]`:'<br>Tidak invertible'}</div>`;};}

function renderStdDev(el,play){el.innerHTML=formHTML([{id:'sdData',label:'Data (koma)',placeholder:'2,4,4,4,5,5,7,9'}],'Hitung')+`<div class="result-box" id="sdOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const arr=el.querySelector('#sdData').value.split(',').map(s=>+s.trim()).filter(n=>!isNaN(n));if(!arr.length)return;const n=arr.length,mean=arr.reduce((a,b)=>a+b,0)/n;const v=arr.reduce((a,b)=>a+(b-mean)**2,0)/n;const out=el.querySelector('#sdOut');out.style.display='block';out.innerHTML=`<div class="detail">Mean: <strong>${fmt(mean)}</strong><br>Variance: <strong>${fmt(v)}</strong><br>SD: <strong>${fmt(Math.sqrt(v))}</strong></div>`;};}

function renderComplex(el,play){el.innerHTML=formHTML([{id:'cxA',label:'a (real 1)',placeholder:'3'},{id:'cxB',label:'b (imag 1)',placeholder:'2'},{id:'cxC',label:'c (real 2)',placeholder:'1'},{id:'cxD',label:'d (imag 2)',placeholder:'4'},{id:'cxOp',label:'Operasi',type:'select',options:[['+','+'],['-','−'],['*','×']]}],'Hitung')+`<div class="result-box" id="cxOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const a=+el.querySelector('#cxA').value,b=+el.querySelector('#cxB').value,c=+el.querySelector('#cxC').value,d=+el.querySelector('#cxD').value,op=el.querySelector('#cxOp').value;let r,i;if(op==='+'){r=a+c;i=b+d;}else if(op==='-'){r=a-c;i=b-d;}else{r=a*c-b*d;i=a*d+b*c;}const out=el.querySelector('#cxOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(r)} ${i>=0?'+':''} ${fmt(i)}i</div>`;};}

function renderAngle(el,play){el.innerHTML=formHTML([{id:'anVal',label:'Nilai',placeholder:'180'},{id:'anFrom',label:'Dari',type:'select',options:[['deg','Degree'],['rad','Radian']]}],'Konversi')+`<div class="result-box" id="anOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const v=+el.querySelector('#anVal').value,from=el.querySelector('#anFrom').value;const out=el.querySelector('#anOut');out.style.display='block';if(from==='deg')out.innerHTML=`<div class="value">${fmt(v*Math.PI/180)} rad</div>`;else out.innerHTML=`<div class="value">${fmt(v*180/Math.PI)} °</div>`;};}

function renderPrime(el,play){el.innerHTML=formHTML([{id:'prN',label:'Angka',placeholder:'17'}],'Cek')+`<div class="result-box" id="prOut3" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const n=Math.floor(+el.querySelector('#prN').value);if(n<2){el.querySelector('#prOut3').style.display='block';el.querySelector('#prOut3').innerHTML='<div class="value">Bukan prima</div>';return;}let ok=true;for(let i=2;i*i<=n;i++)if(n%i===0){ok=false;break;}const factors=[];for(let i=1;i<=n;i++)if(n%i===0)factors.push(i);const out=el.querySelector('#prOut3');out.style.display='block';out.innerHTML=`<div class="value">${ok?'Prima':'Bukan prima'}</div><div class="detail">Faktor: ${factors.join(', ')}</div>`;};}

function renderModulo(el,play){el.innerHTML=formHTML([{id:'mdA',label:'a',placeholder:'17'},{id:'mdB',label:'b',placeholder:'5'}],'Hitung')+`<div class="result-box" id="mdOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const a=+el.querySelector('#mdA').value,b=+el.querySelector('#mdB').value;if(!b)return;const out=el.querySelector('#mdOut');out.style.display='block';out.innerHTML=`<div class="detail">a ÷ b = <strong>${Math.floor(a/b)}</strong><br>a mod b = <strong>${a%b}</strong></div>`;};}

function renderMAP(el,play){el.innerHTML=formHTML([{id:'mpSys',label:'Sistolik',placeholder:'120'},{id:'mpDia',label:'Diastolik',placeholder:'80'}],'Hitung MAP')+`<div class="result-box" id="mpOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const s=+el.querySelector('#mpSys').value,d=+el.querySelector('#mpDia').value;const map=(s+2*d)/3;const out=el.querySelector('#mpOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(map)} mmHg</div>`;};}

function renderIVDrip(el,play){el.innerHTML=formHTML([{id:'ivVol',label:'Volume (mL)',placeholder:'500'},{id:'ivTime',label:'Waktu (jam)',placeholder:'4'},{id:'ivDrop',label:'Drop factor (gtt/mL)',placeholder:'20'}],'Hitung')+`<div class="result-box" id="ivOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const v=+el.querySelector('#ivVol').value,t=+el.querySelector('#ivTime').value,df=+el.querySelector('#ivDrop').value;if(!t)return;const rate=(v*df)/(t*60);const out=el.querySelector('#ivOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(rate)} gtt/min</div>`;};}

function renderIdealRange(el,play){el.innerHTML=formHTML([{id:'irH',label:'Tinggi (cm)',placeholder:'170'}],'Hitung')+`<div class="result-box" id="irOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const h=+el.querySelector('#irH').value/100;if(!h)return;const lo=18.5*h*h,hi=24.9*h*h;const out=el.querySelector('#irOut');out.style.display='block';out.innerHTML=`<div class="detail">Berat ideal: <strong>${fmt(lo)} – ${fmt(hi)} kg</strong></div>`;};}

function renderWater(el,play){el.innerHTML=formHTML([{id:'waW',label:'Berat (kg)',placeholder:'70'}],'Hitung')+`<div class="result-box" id="waOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const w=+el.querySelector('#waW').value;const ml=w*35;const out=el.querySelector('#waOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(ml)} mL/hari</div><div class="detail">≈ ${fmt(ml/1000)} liter</div>`;};}

function renderIPv6(el,play){el.innerHTML=formHTML([{id:'v6P',label:'Prefix length',placeholder:'64'}],'Info')+`<div class="result-box" id="v6Out" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const p=+el.querySelector('#v6P').value;if(p<0||p>128)return;const hosts=p>=128?1:2n**(BigInt(128-p));const out=el.querySelector('#v6Out');out.style.display='block';out.innerHTML=`<div class="detail">Alamat dalam /${p}: <strong>${hosts.toLocaleString()}</strong></div>`;};}

function renderPort(el,play){const ports={20:'FTP data',21:'FTP',22:'SSH',23:'Telnet',25:'SMTP',53:'DNS',80:'HTTP',110:'POP3',143:'IMAP',443:'HTTPS',3306:'MySQL',5432:'PostgreSQL',6379:'Redis',8080:'HTTP alt'};el.innerHTML=formHTML([{id:'poN',label:'Port number',placeholder:'443'}],'Cek')+`<div class="result-box" id="poOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const n=+el.querySelector('#poN').value;const out=el.querySelector('#poOut');out.style.display='block';out.innerHTML=`<div class="value">${ports[n]||'Tidak dikenal / custom'}</div>`;};}

function renderSubnetHosts(el,play){el.innerHTML=formHTML([{id:'shC',label:'CIDR',placeholder:'24'}],'Hitung')+`<div class="result-box" id="shOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const c=+el.querySelector('#shC').value;if(c<0||c>32)return;const h=c>=31?(c===32?1:2):2**(32-c)-2;const out=el.querySelector('#shOut');out.style.display='block';out.innerHTML=`<div class="value">${h} hosts</div>`;};}

function renderMAC(el,play){el.innerHTML=`<div class="form-group"><label>MAC (aa:bb:cc:dd:ee:ff atau aabbccddeeff)</label><input id="macIn" placeholder="00:1A:2B:3C:4D:5E"></div><button class="btn-calc">Format</button><div class="result-box" id="macOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();let m=el.querySelector('#macIn').value.replace(/[^0-9a-fA-F]/g,'').toUpperCase();if(m.length!==12){el.querySelector('#macOut').style.display='block';el.querySelector('#macOut').innerHTML='<div class="value">Invalid</div>';return;}const colon=m.match(/.{2}/g).join(':');const dash=m.match(/.{2}/g).join('-');const cisco=m.match(/.{4}/g).join('.');const out=el.querySelector('#macOut');out.style.display='block';out.innerHTML=`<div class="detail">${colon}<br>${dash}<br>${cisco}</div>`;};}

function renderBase64(el,play){el.innerHTML=`<div class="form-group"><label>Teks</label><input id="b64In" placeholder="Hello"></div><div class="form-group"><label>Mode</label><select id="b64Mode"><option value="enc">Encode</option><option value="dec">Decode</option></select></div><button class="btn-calc">Proses</button><div class="result-box" id="b64Out" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const t=el.querySelector('#b64In').value,mode=el.querySelector('#b64Mode').value;let r;try{r=mode==='enc'?btoa(t):atob(t);}catch{r='Error';}const out=el.querySelector('#b64Out');out.style.display='block';out.innerHTML=`<div class="value" style="font-size:1rem;word-break:break-all">${r}</div>`;};}

function renderURL(el,play){el.innerHTML=`<div class="form-group"><label>Teks / URL</label><input id="urlIn" placeholder="hello world"></div><div class="form-group"><label>Mode</label><select id="urlMode"><option value="enc">Encode</option><option value="dec">Decode</option></select></div><button class="btn-calc">Proses</button><div class="result-box" id="urlOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const t=el.querySelector('#urlIn').value,mode=el.querySelector('#urlMode').value;const r=mode==='enc'?encodeURIComponent(t):decodeURIComponent(t);const out=el.querySelector('#urlOut');out.style.display='block';out.innerHTML=`<div class="value" style="font-size:1rem;word-break:break-all">${r}</div>`;};}

function renderTransformer(el,play){el.innerHTML=formHTML([{id:'trVp',label:'Vp (V)',placeholder:'220'},{id:'trNp',label:'Np (lilitan primer)',placeholder:'1000'},{id:'trNs',label:'Ns (lilitan sekunder)',placeholder:'50'}],'Hitung Vs')+`<div class="result-box" id="trOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const vp=+el.querySelector('#trVp').value,np=+el.querySelector('#trNp').value,ns=+el.querySelector('#trNs').value;if(!np)return;const vs=vp*ns/np;const out=el.querySelector('#trOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(vs)} V</div><div class="detail">Rasio: ${fmt(np/ns)} : 1</div>`;};}

function renderBattery(el,play){el.innerHTML=formHTML([{id:'btCap',label:'Kapasitas (mAh)',placeholder:'3000'},{id:'btLoad',label:'Beban (mA)',placeholder:'150'}],'Hitung')+`<div class="result-box" id="btOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const cap=+el.querySelector('#btCap').value,load=+el.querySelector('#btLoad').value;if(!load)return;const h=cap/load;const out=el.querySelector('#btOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(h)} jam</div>`;};}

function renderPWM(el,play){el.innerHTML=formHTML([{id:'pwDuty',label:'Duty cycle (%)',placeholder:'50'},{id:'pwV',label:'V supply',placeholder:'5'}],'Hitung')+`<div class="result-box" id="pwOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const d=+el.querySelector('#pwDuty').value,v=+el.querySelector('#pwV').value;const out=el.querySelector('#pwOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(v*d/100)} V avg</div>`;};}

function renderOpAmp(el,play){el.innerHTML=formHTML([{id:'oaType',label:'Tipe',type:'select',options:[['inv','Inverting'],['non','Non-inverting']]},{id:'oaRf',label:'Rf (Ω)',placeholder:'10000'},{id:'oaRin',label:'Rin (Ω)',placeholder:'1000'}],'Hitung Gain')+`<div class="result-box" id="oaOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const t=el.querySelector('#oaType').value,rf=+el.querySelector('#oaRf').value,rin=+el.querySelector('#oaRin').value;if(!rin)return;const g=t==='inv'?-(rf/rin):(1+rf/rin);const out=el.querySelector('#oaOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(g)}</div>`;};}

function render0100(el,play){el.innerHTML=formHTML([{id:'zHP',label:'HP',placeholder:'150'},{id:'zW',label:'Berat (kg)',placeholder:'1200'}],'Estimasi')+`<div class="result-box" id="zOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const hp=+el.querySelector('#zHP').value,w=+el.querySelector('#zW').value;if(!hp||!w)return;const t=Math.pow(w/hp,0.33)*2.5;const out=el.querySelector('#zOut');out.style.display='block';out.innerHTML=`<div class="value">~${fmt(t)} s</div><div class="detail">Estimasi kasar 0–100 km/h</div>`;};}

function renderPwrWeight(el,play){el.innerHTML=formHTML([{id:'pwHP',label:'HP',placeholder:'200'},{id:'pwKg',label:'Berat (kg)',placeholder:'1400'}],'Hitung')+`<div class="result-box" id="pw2Out" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const hp=+el.querySelector('#pwHP').value,kg=+el.querySelector('#pwKg').value;if(!kg)return;const out=el.querySelector('#pw2Out');out.style.display='block';out.innerHTML=`<div class="detail">${fmt(hp/(kg/1000))} HP/ton<br>${fmt(kg/hp)} kg/HP</div>`;};}

function renderFuelCost(el,play){el.innerHTML=formHTML([{id:'fcDist',label:'Jarak (km)',placeholder:'300'},{id:'fcKml',label:'Konsumsi (km/L)',placeholder:'12'},{id:'fcPrice',label:'Harga BBM /L',placeholder:'13000'}],'Hitung')+`<div class="result-box" id="fcOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const d=+el.querySelector('#fcDist').value,k=+el.querySelector('#fcKml').value,p=+el.querySelector('#fcPrice').value;if(!k)return;const liter=d/k,cost=liter*p;const out=el.querySelector('#fcOut');out.style.display='block';out.innerHTML=`<div class="detail">BBM: <strong>${fmt(liter)} L</strong><br>Biaya: <strong>${fmt(cost)}</strong></div>`;};}

function renderGearSpeed(el,play){el.innerHTML=formHTML([{id:'gsRPM',label:'RPM',placeholder:'3000'},{id:'gsRatio',label:'Overall gear ratio',placeholder:'3.5'},{id:'gsTire',label:'Tire diameter (inch)',placeholder:'25'}],'Hitung')+`<div class="result-box" id="gsOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const rpm=+el.querySelector('#gsRPM').value,gr=+el.querySelector('#gsRatio').value,tire=+el.querySelector('#gsTire').value;const mph=(rpm*tire)/(gr*336);const out=el.querySelector('#gsOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(mph*1.60934)} km/h</div>`;};}

function renderWheelHP(el,play){el.innerHTML=formHTML([{id:'whCrank',label:'Crank HP',placeholder:'200'},{id:'whLoss',label:'Drivetrain loss (%)',placeholder:'15'}],'Hitung')+`<div class="result-box" id="whOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const c=+el.querySelector('#whCrank').value,l=+el.querySelector('#whLoss').value;const out=el.querySelector('#whOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(c*(1-l/100))} WHP</div>`;};}

function renderPressure(el,play){el.innerHTML=formHTML([{id:'prF',label:'Gaya (N)',placeholder:'100'},{id:'prA',label:'Luas (m²)',placeholder:'0.01'}],'Hitung P')+`<div class="result-box" id="prOut4" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const f=+el.querySelector('#prF').value,a=+el.querySelector('#prA').value;if(!a)return;const out=el.querySelector('#prOut4');out.style.display='block';out.innerHTML=`<div class="value">${fmt(f/a)} Pa</div>`;};}

function renderOhmsPhys(el,play){el.innerHTML=formHTML([{id:'opV',label:'V',placeholder:'12'},{id:'opR',label:'R (Ω)',placeholder:'100'}],'Hitung I')+`<div class="result-box" id="opOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const v=+el.querySelector('#opV').value,r=+el.querySelector('#opR').value;if(!r)return;const out=el.querySelector('#opOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(v/r)} A</div>`;};}

function renderCoulomb(el,play){el.innerHTML=formHTML([{id:'coQ1',label:'q1 (C)',placeholder:'1e-6'},{id:'coQ2',label:'q2 (C)',placeholder:'1e-6'},{id:'coR',label:'Jarak (m)',placeholder:'0.1'}],'Hitung F')+`<div class="result-box" id="coOut2" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const q1=+el.querySelector('#coQ1').value,q2=+el.querySelector('#coQ2').value,r=+el.querySelector('#coR').value;if(!r)return;const k=8.99e9;const out=el.querySelector('#coOut2');out.style.display='block';out.innerHTML=`<div class="value">${fmt(k*q1*q2/(r*r))} N</div>`;};}

function renderSnell(el,play){el.innerHTML=formHTML([{id:'snN1',label:'n1',placeholder:'1'},{id:'snT1',label:'θ1 (derajat)',placeholder:'30'},{id:'snN2',label:'n2',placeholder:'1.33'}],'Hitung θ2')+`<div class="result-box" id="snOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const n1=+el.querySelector('#snN1').value,t1=+el.querySelector('#snT1').value*Math.PI/180,n2=+el.querySelector('#snN2').value;const s=n1*Math.sin(t1)/n2;if(Math.abs(s)>1){el.querySelector('#snOut').style.display='block';el.querySelector('#snOut').innerHTML='<div class="value">Total internal reflection</div>';return;}const t2=Math.asin(s)*180/Math.PI;const out=el.querySelector('#snOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(t2)}°</div>`;};}

function renderOrbVel(el,play){el.innerHTML=formHTML([{id:'ovR',label:'Radius orbit (km)',placeholder:'6771'},{id:'ovMu',label:'μ (km³/s²)',placeholder:'398600'}],'Hitung')+`<div class="result-box" id="ovOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const r=+el.querySelector('#ovR').value,mu=+el.querySelector('#ovMu').value;const v=Math.sqrt(mu/r);const out=el.querySelector('#ovOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(v)} km/s</div>`;};}

function renderSynodic(el,play){el.innerHTML=formHTML([{id:'syT1',label:'Periode 1 (hari)',placeholder:'365.25'},{id:'syT2',label:'Periode 2 (hari)',placeholder:'686.98'}],'Hitung')+`<div class="result-box" id="syOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const t1=+el.querySelector('#syT1').value,t2=+el.querySelector('#syT2').value;const s=1/Math.abs(1/t1-1/t2);const out=el.querySelector('#syOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(s)} hari</div>`;};}

function renderRocketMass(el,play){el.innerHTML=formHTML([{id:'rmDv',label:'Δv (m/s)',placeholder:'9400'},{id:'rmIsp',label:'Isp (s)',placeholder:'300'}],'Hitung mass ratio')+`<div class="result-box" id="rmOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const dv=+el.querySelector('#rmDv').value,isp=+el.querySelector('#rmIsp').value;const ve=isp*9.80665;const ratio=Math.exp(dv/ve);const out=el.querySelector('#rmOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(ratio)}</div><div class="detail">m₀/mf</div>`;};}

function renderLightTime(el,play){el.innerHTML=formHTML([{id:'ltDist',label:'Jarak (km)',placeholder:'149597870.7'}],'Hitung')+`<div class="result-box" id="ltOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const d=+el.querySelector('#ltDist').value;const t=d/299792.458;const out=el.querySelector('#ltOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(t)} detik</div><div class="detail">${fmt(t/60)} menit</div>`;};}

function renderSchwarz(el,play){el.innerHTML=formHTML([{id:'swM',label:'Massa (kg)',placeholder:'1.989e30'}],'Hitung Rs')+`<div class="result-box" id="swOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const M=+el.querySelector('#swM').value;const G=6.67430e-11,c=299792458;const rs=2*G*M/(c*c);const out=el.querySelector('#swOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(rs)} m</div><div class="detail">${fmt(rs/1000)} km</div>`;};}

function renderKepler3(el,play){el.innerHTML=formHTML([{id:'k3A',label:'Semi-major axis a (AU)',placeholder:'1'},{id:'k3M',label:'Massa pusat (M☉)',placeholder:'1'}],'Hitung T')+`<div class="result-box" id="k3Out" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const a=+el.querySelector('#k3A').value,m=+el.querySelector('#k3M').value;const T=Math.sqrt(a*a*a/m);const out=el.querySelector('#k3Out');out.style.display='block';out.innerHTML=`<div class="value">${fmt(T)} tahun</div>`;};}

function renderMortgage(el,play){el.innerHTML=formHTML([{id:'moP',label:'Pokok pinjaman',placeholder:'500000000'},{id:'moR',label:'Bunga / tahun (%)',placeholder:'8'},{id:'moN',label:'Tenor (bulan)',placeholder:'180'}],'Hitung')+`<div class="result-box" id="moOut2" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const P=+el.querySelector('#moP').value,r=+el.querySelector('#moR').value/100/12,n=+el.querySelector('#moN').value;const emi=r===0?P/n:P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);const out=el.querySelector('#moOut2');out.style.display='block';out.innerHTML=`<div class="value">${fmt(emi)}</div><div class="detail">Total: ${fmt(emi*n)} · Bunga: ${fmt(emi*n-P)}</div>`;};}

function renderPayback(el,play){el.innerHTML=formHTML([{id:'pbInv',label:'Investasi awal',placeholder:'100000000'},{id:'pbCF',label:'Cash flow / tahun',placeholder:'25000000'}],'Hitung')+`<div class="result-box" id="pbOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const inv=+el.querySelector('#pbInv').value,cf=+el.querySelector('#pbCF').value;if(!cf)return;const out=el.querySelector('#pbOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(inv/cf)} tahun</div>`;};}

function renderCAGR(el,play){el.innerHTML=formHTML([{id:'cgBegin',label:'Nilai awal',placeholder:'10000000'},{id:'cgEnd',label:'Nilai akhir',placeholder:'25000000'},{id:'cgY',label:'Tahun',placeholder:'5'}],'Hitung CAGR')+`<div class="result-box" id="cgOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const b=+el.querySelector('#cgBegin').value,e=+el.querySelector('#cgEnd').value,y=+el.querySelector('#cgY').value;if(!b||!y)return;const cagr=(Math.pow(e/b,1/y)-1)*100;const out=el.querySelector('#cgOut');out.style.display='block';out.innerHTML=`<div class="value">${cagr.toFixed(2)}%</div>`;};}

function renderMarkupPrice(el,play){el.innerHTML=formHTML([{id:'mkCost',label:'Cost',placeholder:'80000'},{id:'mkPct',label:'Markup (%)',placeholder:'50'}],'Hitung harga jual')+`<div class="result-box" id="mkOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const c=+el.querySelector('#mkCost').value,p=+el.querySelector('#mkPct').value;const out=el.querySelector('#mkOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(c*(1+p/100))}</div>`;};}

function renderBeam(el,play){el.innerHTML=formHTML([{id:'beF',label:'Load F (N)',placeholder:'1000'},{id:'beL',label:'Panjang L (m)',placeholder:'2'},{id:'beE',label:'E (Pa)',placeholder:'2e11'},{id:'beI',label:'I (m⁴)',placeholder:'1e-6'}],'Hitung defleksi max')+`<div class="result-box" id="beOut2" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const F=+el.querySelector('#beF').value,L=+el.querySelector('#beL').value,E=+el.querySelector('#beE').value,I=+el.querySelector('#beI').value;const d=F*L**3/(3*E*I);const out=el.querySelector('#beOut2');out.style.display='block';out.innerHTML=`<div class="value">${fmt(d)} m</div><div class="detail">Cantilever tip load (approx)</div>`;};}

function renderTorqueTech(el,play){el.innerHTML=formHTML([{id:'tqF',label:'Gaya (N)',placeholder:'100'},{id:'tqR',label:'Lengan (m)',placeholder:'0.3'}],'Hitung τ')+`<div class="result-box" id="tqOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const f=+el.querySelector('#tqF').value,r=+el.querySelector('#tqR').value;const out=el.querySelector('#tqOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(f*r)} N·m</div>`;};}

function renderRPMrad(el,play){el.innerHTML=formHTML([{id:'rrVal',label:'Nilai',placeholder:'3000'},{id:'rrFrom',label:'Dari',type:'select',options:[['rpm','RPM'],['rad','rad/s']]}],'Konversi')+`<div class="result-box" id="rrOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const v=+el.querySelector('#rrVal').value,from=el.querySelector('#rrFrom').value;const out=el.querySelector('#rrOut');out.style.display='block';if(from==='rpm')out.innerHTML=`<div class="value">${fmt(v*2*Math.PI/60)} rad/s</div>`;else out.innerHTML=`<div class="value">${fmt(v*60/(2*Math.PI))} RPM</div>`;};}

function renderHeat(el,play){el.innerHTML=formHTML([{id:'htM',label:'Massa (kg)',placeholder:'1'},{id:'htC',label:'c (J/kg·K)',placeholder:'4186'},{id:'htDT',label:'ΔT (K)',placeholder:'10'}],'Hitung Q')+`<div class="result-box" id="htOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const m=+el.querySelector('#htM').value,c=+el.querySelector('#htC').value,dt=+el.querySelector('#htDT').value;const out=el.querySelector('#htOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(m*c*dt)} J</div>`;};}

function renderReynold(el,play){el.innerHTML=formHTML([{id:'reRho',label:'ρ (kg/m³)',placeholder:'1000'},{id:'reV',label:'v (m/s)',placeholder:'1'},{id:'reD',label:'D (m)',placeholder:'0.05'},{id:'reMu',label:'μ (Pa·s)',placeholder:'0.001'}],'Hitung Re')+`<div class="result-box" id="reOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const rho=+el.querySelector('#reRho').value,v=+el.querySelector('#reV').value,D=+el.querySelector('#reD').value,mu=+el.querySelector('#reMu').value;if(!mu)return;const re=rho*v*D/mu;const out=el.querySelector('#reOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(re)}</div><div class="detail">${re<2300?'Laminar':re>4000?'Turbulent':'Transisi'}</div>`;};}

function renderBolt(el,play){el.innerHTML=formHTML([{id:'boK',label:'K factor',placeholder:'0.2'},{id:'boD',label:'Diameter (m)',placeholder:'0.01'},{id:'boF',label:'Clamp force (N)',placeholder:'5000'}],'Hitung T')+`<div class="result-box" id="boOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const k=+el.querySelector('#boK').value,d=+el.querySelector('#boD').value,f=+el.querySelector('#boF').value;const out=el.querySelector('#boOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(k*d*f)} N·m</div>`;};}

function renderUnitPressure(el,play){el.innerHTML=formHTML([{id:'upVal',label:'Nilai',placeholder:'1'},{id:'upFrom',label:'Dari',type:'select',options:[['Pa','Pa'],['bar','bar'],['psi','psi'],['atm','atm']]},{id:'upTo',label:'Ke',type:'select',options:[['Pa','Pa'],['bar','bar'],['psi','psi'],['atm','atm']]}],'Konversi')+`<div class="result-box" id="upOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const f={Pa:1,bar:1e5,psi:6894.76,atm:101325};const v=+el.querySelector('#upVal').value,from=el.querySelector('#upFrom').value,to=el.querySelector('#upTo').value;const out=el.querySelector('#upOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(v*f[from]/f[to])} ${to}</div>`;};}

function renderSteel(el,play){el.innerHTML=formHTML([{id:'stL',label:'Panjang (m)',placeholder:'6'},{id:'stW',label:'Lebar (m)',placeholder:'1'},{id:'stT',label:'Tebal (mm)',placeholder:'10'},{id:'stRho',label:'ρ (kg/m³)',placeholder:'7850'}],'Hitung berat')+`<div class="result-box" id="stOut" style="display:none"></div>`;el.querySelector('.btn-calc').onclick=()=>{play();const l=+el.querySelector('#stL').value,w=+el.querySelector('#stW').value,t=+el.querySelector('#stT').value/1000,rho=+el.querySelector('#stRho').value;const out=el.querySelector('#stOut');out.style.display='block';out.innerHTML=`<div class="value">${fmt(l*w*t*rho)} kg</div>`;};}


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

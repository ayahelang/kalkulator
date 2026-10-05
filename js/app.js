import { renderCalculator } from './calculators.js';

let allCalcs = [];
let categories = [];
let currentFilter = 'all';
let searchQuery = '';

const gallery = document.getElementById('gallery');
const filterTabs = document.getElementById('filterTabs');
const searchInput = document.getElementById('searchInput');
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const resultCount = document.getElementById('resultCount');

// Web Audio for button clicks
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export function playClick(freq = 800, duration = 0.04) {
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = 'square';
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

// Fallback data (jika fetch gagal / dibuka via file://)
const FALLBACK = {
  "categories": [
    { "id": "all", "name": "Semua", "icon": "⊞" },
    { "id": "umum", "name": "Umum", "icon": "🔢" },
    { "id": "ilmiah", "name": "Ilmiah", "icon": "🔬" },
    { "id": "keuangan", "name": "Keuangan & Bisnis", "icon": "💰" },
    { "id": "it", "name": "IT & Networking", "icon": "🌐" },
    { "id": "elektronik", "name": "Elektronik", "icon": "⚡" },
    { "id": "otomotif", "name": "Otomotif", "icon": "🚗" },
    { "id": "fisika", "name": "Fisika", "icon": "⚛️" },
    { "id": "kesehatan", "name": "Kesehatan", "icon": "❤️" },
    { "id": "antariksa", "name": "Antariksa", "icon": "🚀" },
    { "id": "teknik", "name": "Teknik", "icon": "🔧" }
  ],
  "calculators": null // will be filled from JSON or keep empty
};

async function init() {
  gallery.innerHTML = `<div class="empty"><div class="empty-icon">⏳</div><p>Memuat daftar kalkulator...</p></div>`;
  try {
    const res = await fetch('./data/calculators.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    categories = data.categories || FALLBACK.categories;
    allCalcs = data.calculators || [];
  } catch (err) {
    console.warn('Fetch gagal (buka via local server / npx serve .):', err.message);
    categories = FALLBACK.categories;
    allCalcs = [];
    gallery.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div>
      <p>Gagal memuat data.<br>Jalankan dengan local server:<br><code style="color:var(--accent)">npx serve .</code></p></div>`;
    renderFilters();
    return;
  }
  // Dari awal: tampilkan SEMUA card dalam bentuk gallery
  currentFilter = 'all';
  searchQuery = '';
  if (searchInput) searchInput.value = '';
  renderFilters();
  renderGallery();
}

function renderFilters() {
  filterTabs.innerHTML = categories.map(c => `
    <button class="filter-tab ${c.id === currentFilter ? 'active' : ''}" data-id="${c.id}">
      ${c.icon} ${c.name}
    </button>
  `).join('');

  filterTabs.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      playClick(600);
      currentFilter = btn.dataset.id;
      // Reset search when changing category for clearer UX
      // (opsional – biarkan search tetap jika user ingin kombinasi)
      filterTabs.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery();
    });
  });
}

function renderGallery() {
  const q = searchQuery.toLowerCase().trim();
  const list = allCalcs.filter(c => {
    const matchCat = currentFilter === 'all' || c.category === currentFilter;
    const matchSearch = !q ||
      c.name.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(q)));
    return matchCat && matchSearch;
  });

  // Update result count
  if (resultCount) {
    if (currentFilter === 'all' && !q) {
      resultCount.textContent = `Menampilkan semua ${list.length} kalkulator`;
    } else {
      resultCount.textContent = `Menampilkan ${list.length} dari ${allCalcs.length} kalkulator`;
    }
  }

  if (list.length === 0) {
    gallery.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🔍</div>
        <p>Tidak ada kalkulator yang cocok.</p>
        <button class="filter-tab" id="resetFilter" style="margin-top:1rem">Tampilkan Semua</button>
      </div>`;
    document.getElementById('resetFilter')?.addEventListener('click', () => {
      currentFilter = 'all';
      searchQuery = '';
      searchInput.value = '';
      renderFilters();
      renderGallery();
    });
    return;
  }

  // SEMUA card ditampilkan sebagai grid card gallery
  gallery.innerHTML = list.map((c, i) => `
    <article class="card" data-id="${c.id}" style="animation-delay:${Math.min(i * 0.025, 0.4)}s">
      <div class="card-icon">${c.icon}</div>
      <div class="card-title">${c.name}</div>
      <div class="card-desc">${c.desc}</div>
      <div class="card-cat">${categories.find(cat => cat.id === c.category)?.name || c.category}</div>
    </article>
  `).join('');

  gallery.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      playClick(900);
      openCalc(card.dataset.id);
    });
  });
}

function openCalc(id) {
  const calc = allCalcs.find(c => c.id === id);
  if (!calc) return;
  modalTitle.innerHTML = `${calc.icon} ${calc.name}`;
  modalBody.innerHTML = '';
  renderCalculator(id, modalBody, playClick);
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  playClick(500);
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value;
  renderGallery();
});

init();

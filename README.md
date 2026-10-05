# Kalkulator Silverhawk

Web app kumpulan kalkulator profesional multi-bidang.

**Subdomain target:** https://kalkulator.silverhawk.web.id  
**Inspirasi desain:** https://silverhawk.web.id

## Fitur

- Card gallery dengan search & filter kategori
- 30+ kalkulator fungsional (ilmiah, keuangan, IT, elektronik, otomotif, fisika, kesehatan, antariksa)
- Responsive, modern dark theme, animasi halus
- Suara klik tombol (Web Audio API)
- Lampu indikator display seperti kalkulator nyata
- Ringan: pure HTML + CSS + JS (ES modules) + JSON
- Tidak butuh backend (Supabase opsional untuk fitur masa depan)

## Struktur

```
kalkulator-silverhawk/
├── index.html
├── css/style.css
├── js/app.js
├── js/calculators.js
├── data/calculators.json
└── README.md
```

## Cara menjalankan

Buka `index.html` via local server (karena ES modules):

```bash
npx serve .
# atau
python -m http.server 8080
```

Lalu buka http://localhost:8080

## Deploy

Upload seluruh folder ke hosting (GitHub Pages, Netlify, Vercel, atau subdomain silverhawk).

## Kategori Kalkulator

- Umum
- Ilmiah
- Keuangan & Bisnis
- IT & Networking
- Elektronik
- Otomotif
- Fisika
- Kesehatan
- Antariksa
- Teknik

© 2026 Silverhawk Network

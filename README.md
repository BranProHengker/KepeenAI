# ☕ KepeenAI — Ultimate Workspace & PC Roast Assistant

> **Literally the most aesthetic and honest workspace auditor in the town, fr.**

KepeenAI adalah project berbasis **Astro framework** dengan asisten AI interaktif berkepribadian "anak Jaksel" yang super santai, gaul, tapi julid parah buat nge-roast kebersihan, kerapian, estetika meja kerja/kamar lu, sekaligus menilai spesifikasi PC lu dengan tier-rating yang akurat.

---

## ✨ Features

### 1. 🔥 Roast Setup (Adu Kebersihan & Kerapian)
* Upload foto meja kerja, kamar, atau sudut ruangan lu.
* AI bakal langsung nge-roast estetika, kebersihan, dan manajemen kabel setup lu.
* Dapatkan **Structural Score** (Skor Struktur) lengkap dengan penentuan Tier (S, A, B, C, hingga F) dan rekomendasi perbaikan.
* *Rule utama:* PC puluhan juta gak menjamin nilai bagus kalau kamar lu kayak sarang kecoak, ngab!

### 2. 🔄 Compare Before/After (Glow-Up Tracker)
* Unggah 2 foto perbandingan setup lu (sebelum dan sesudah diberesin).
* Dapatkan evaluasi **Glow-Up Score** untuk melihat seberapa besar peningkatan usaha beres-beres lu, lengkap dengan roasting sisa-sisa bagian yang masih minus.

### 3. 🖥️ Rate My PC & Upgrade Advisor
* Masukkan detail komponen PC lu (CPU, GPU, RAM).
* AI bakal ngasih **PC Rating %** dan memproyeksikan performa FPS & resolusi grafis untuk game-game populer.
* Punya budget sisa? Tulis di **Upgrade Advisor** beserta target game/kebutuhan lu, AI bakal kasih rekomendasi upgrade part yang paling worth-it!

### 4. 📐 Desk Planner AI
* Bingung mau nata meja? Tulis ukuran meja, periferal yang lu punya, dan tema aesthetic favorit lu (Cyberpunk RGB, Minimalist Monokrom, Cozy Warm Wood).
* AI bakal rancang layout workspace yang paling ergonomis, rapi, dan fungsional.

### 5. ⌨️ Pro UX Features
* **Ctrl + Enter Keyboard Shortcut**: Submit semua formulir specs dan pesan chat secara instan tanpa perlu klik tombol kirim.
* **IndexedDB History Isolation**: Obrolan di setiap tab terisolasi dan tersimpan otomatis secara lokal di browser, riwayat chat gak bakal hilang saat di-refresh!
* **Aesthetic Transitions**: Dibuat dengan micro-animations smooth dari Framer Motion untuk transisi perpindahan tab mode yang responsive.

---

## 🛠️ Tech Stack

* **Framework Utama**: Astro (Static Site Generation & Server-Side Rendering)
* **Frontend Components**: React (integrated via `@astrojs/react`) & TypeScript
* **Styling**: Tailwind CSS & Vanilla CSS (Fluid Glassmorphic theme)
* **Animation & Icons**: Framer Motion & Lucide React
* **Database**: IndexedDB (Local chat history persistence)
* **AI Engine**: Google Gemini API via `@google/genai` SDK (running on Astro API routes)

---

## 🚀 Getting Started

### 1. Clone the repository & Install dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Buat file `.env` di root direktori proyek dan masukkan Gemini API Key lu:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
pnpm run dev
```
Buka browser dan akses ke [http://localhost:4321](http://localhost:4321) (atau port yang tertera di terminal).

### 4. Build for Production
```bash
pnpm run build
```

---

## 📝 License
Proyek ini dibuat untuk bersenang-senang dan meningkatkan kualitas hidup setup workspace lu. *Keep it clean, stay aesthetic, fr!*

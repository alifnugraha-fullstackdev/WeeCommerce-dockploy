# WeeCommerce - Hub Dokumentasi & Cetak Biru (Blueprint Hub)

Selamat datang di repositori pusat arsitektur, dokumentasi teknis, dan cetak biru untuk **WeeCommerce** ("Sistem E-Commerce, Ditenagai oleh AI") milik **Muhammad Alif Maulana Nugraha**.

Repositori ini telah dibersihkan secara sistematis untuk bertindak sebagai satu-satunya *source of truth* terkait strategi merek, profil perusahaan, arsitektur sistem, dan dokumen optimasi mesin pencari (SEO/AEO/GEO).

---

## 1. STRUKTUR UTAMA REPOSITORI

```
WeeCommerce/
├── docs/                                    # Folder Dokumentasi Arsitektur & Strategi
│   ├── README.md                            # Sitemap & Indeks Navigasi Dokumentasi
│   ├── 01-project-overview.md               # Ikhtisar teknis & tujuan bisnis
│   ├── 02-system-architecture.md            # Diagram arsitektur & jaringan docker
│   ├── 03-user-role-permission.md           # Matriks hak akses RBAC
│   ├── 04-authentication.md                 # Alur JWT, session, & hashing password
│   ├── 05-database-design.md                # Skema tabel & indeks PostgreSQL
│   ├── 16-admin-panel.md                    # Dashboard administrasi & audit trail
│   ├── 17-api-design.md                     # Cetak biru REST API & rate limiting
│   ├── 18-ui-pages.md                       # Matriks halaman TanStack Router & UI
│   ├── 19-development-roadmap.md            # Peta jalan pengembangan 3-tahap
│   ├── 20-future-features.md                # Rencana pengembangan fitur masa depan
│   ├── 21-development-timeline.md           # Lini masa rilis (Lokal, Staging, Produksi)
│   ├── 22-localization-internationalization.md # Protokol lokalisasi & hook i18n
│   └── SEO.md                               # Protokol SEO, AEO, & GEO dwibahasa
├── docs/                                    # Folder Dokumentasi
├── WeeCommerce-Brand-Blueprint.txt          # Panduan identitas brand & copywriting
└── WeeCommerce-Company-Profile.txt          # Profil legal perusahaan & visi misi
```

---

## 2. SPESIFIKASI TEKNOLOGI INTI (TECH STACK)
* **Frontend**: React + TanStack (Router/Query) + Shadcn UI + Framer Motion.
* **Backend API**: Next.js / Vite (Node.js runtime environment).
* **Database**: PostgreSQL.
* **Orkestrasi Server**: Docker Compose & Dokploy.

---

## 3. TAHAP DEPLOYMENT & ALUR RILIS
1. **Fase 1 (Lokal)**: Pengembangan bare-metal cepat menggunakan `pnpm` tanpa virtualisasi, konfigurasi penuh di `.env.local`.
2. **Fase 2 (Staging)**: Build container otomatis dan deployment uji coba di VPS melalui Dokploy menggunakan Docker Compose.
3. **Fase 3 (Produksi)**: Pengerasan keamanan (SSL HSTS, penutupan port publik database, backup otomatis harian ke Cloudflare R2), audit performa Core Web Vitals, dan peluncuran publik.

Untuk navigasi lengkap mengenai seluruh dokumen teknis, silakan merujuk pada [docs/README.md](file:///C:/Users/SMK%20IT%20IQRO/Documents/WeeCommerce/docs/README.md).
# WeeCommerce-Fullstack
# WeeCommerce-Fullstack

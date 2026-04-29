# Aplikasi Donor & Stok Darah — PMI Kab. Indragiri Hilir

Research & Development · Waterfall Model · Web-based

---

### Tech stack

- **Next.js**
    - Frontend
- **Express.js**
    - Backend API
- **MongoDB**
    - Database
- **TypeScript**
    - Full-stack language

---

### Aktor sistem

- **Admin (Petugas PMI)**
    - Akses penuh — kelola semua data
- **Publik (Pendonor)**
    - Lihat stok, jadwal, berita & terima notif WA

---

### Fitur utama

- **Stok darah real-time**
    - Per golongan darah,
    - update otomatis
- **Data pendonor**
    - CRUD, cegah duplikasi
    - via no. WhatsApp
- **Transaksi darah**
    - Darah masuk/keluar,
    - sync stok otomatis
- **Jadwal donor**
    - Lokasi & waktu,
    - tampil ke publik
- **Notifikasi WA**
    - WA Gateway API,
    - pengingat 90 hari
- **Berita PMI**
    - Upload foto & narasi,
    - tampil ke publik

---

### Arsitektur sistem

- **Client**
    - Next.js (TSX)
- **REST API**
    - Express.js (TS)
- **Database**
    - MongoDB Atlas
- **WA Gateway**
    - Notifikasi pendonor

---

### Tahapan pengembangan (Waterfall)

1. **Analisis**
    - PIECES
2. **Desain**
    - UML, UI/UX
3. **Implementasi**
    - Coding
4. **Pengujian**
    - Black Box
5. **Deploy**
    - Produksi

---

### Koleksi MongoDB yang dibutuhkan

- pendonor
- stok_darah
- transaksi
- jadwal
- berita
- notifikasi_log

---

### Catatan penting

- · Proposal menyebut React.js di BAB IV, namun BRD menetapkan Next.js — Next.js yang digunakan (sudah include React)
- · WA Gateway perlu integrasi pihak ketiga (Fonnte / Wablas / WhatsApp Cloud API)
- · Autentikasi hanya Admin (JWT) — publik akses tanpa login

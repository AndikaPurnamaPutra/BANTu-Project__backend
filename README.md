# BANTu Project

## Deskripsi Proyek

BANTu Project adalah sistem website berbasis React JS untuk frontend dan Express JS dengan MongoDB untuk backend. Website ini dibuat untuk menampilkan portofolio karya alumni dan mahasiswa Program Studi Desain Komunikasi Visual (DKV).

Tujuan utama proyek adalah menyediakan platform digital yang memungkinkan para desainer memamerkan karya mereka kepada calon pemberi kerja dan publik secara luas.

---

## Fitur Utama

- Galeri Portofolio menampilkan karya terbaik alumni dan mahasiswa DKV.
- Profil Artist/Desainer memuat data pribadi, profil singkat, dan karya unggulan.
- Halaman Tentang BANTu Project yang menjelaskan manfaat dan tujuan platform.
- Upload dan manajemen karya.
- Sistem login dan manajemen hak akses menggunakan JWT.

---

## Struktur Folder
BANTu-Project/
├─ Backend/
│ ├─ config/
│ ├─ controllers/
│ ├─ middleware/
│ ├─ moduls/
│ ├─ routes/
│ ├─ uploads/
│ ├─ validators/
│ ├─ node_modules/
│ ├─ .env
│ ├─ package.json
│ └─ index.js
│
├─ Frontend/
│ ├─ public/
│ ├─ src/
│ │ ├─ assets/
│ │ ├─ components/
│ │ ├─ data/
│ │ ├─ pages/
│ │ ├─ services/
│ │ ├─ store/
│ │ ├─ App.jsx
│ │ ├─ main.jsx
│ │ ├─ index.css
│ │ └─ App.css
│ ├─ node_modules/
│ ├─ package.json
│ ├─ vite.config.js
│ └─ index.html
│
└─ .gitignore


---

## Teknologi yang Digunakan

- Frontend: React JS, Vite
- Backend: Node.js, Express JS
- Database: MongoDB
- Autentikasi: JWT
- Deployment: Heroku, Vercel, Netlify, atau VPS

---

## Instalasi dan Setup

### Backend

1.  Masuk ke folder backend  
    cd Backend

2.  Install dependencies
    npm install


2.  Buat file .env dengan isi:
    DATABASE_URL=[]
    JWT_SECRET=[]
    PORT=3000
    CLOUDINARY_CLOUD_NAME=[]
    CLOUDINARY_API_KEY=[]
    CLOUDINARY_API_SECRET=[]
    
    Jalankan server backend

    npm start

### Frontend
1.  Masuk ke folder frontend
    cd ../Frontend
    
2.  Install dependencies
    Install
    
3.  Jalankan development server
    npm run dev
    
    Akses http://localhost:5173 di browser
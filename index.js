// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const userRoutes = require('./routes/userRoutes');
// const portfolioRoutes = require('./routes/portfolioRoutes');
// const projectRoutes = require('./routes/projectRoutes');
// const projectDesignerRoutes = require('./routes/projectDesignerRoutes');
// const forumRoutes = require('./routes/forumRoutes');
// const commentForumRoutes = require('./routes/commentForumRoutes');
// const artikelRoutes = require('./routes/artikelRoutes');
// const eventRoutes = require('./routes/eventRoutes');
// const userEventRoutes = require('./routes/userEventRoutes');
// const lokerRoutes = require('./routes/lokerRoutes');
// const userLokerRoutes = require('./routes/userLokerRoutes');
// const adminRoutes = require('./routes/adminRoutes'); // Rute untuk admin

// dotenv.config();
// connectDB();

// const app = express();

// const allowedOrigins = [
//   'http://localhost:5173', // frontend lokal development Vite
//   'http://localhost:4173',
//   'https://ban-tu-project-frontend.vercel.app', // frontend production Vercel
//   'https://bantuproojek.vercel.app',
//   'https://bantu-proojek.com',
//   'https://www.bantu-proojek.com',
//   'https://your-frontend-railway-url.up.railway.app',
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Kalau request dari Postman, curl, dll (no origin)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//     credentials: true, // kalau menggunakan cookie/session
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static folder untuk akses file upload profile pics & portfolio media
// app.use('/uploads/profilePics', express.static('uploads/profilePics'));
// app.use('/uploads/portfolios', express.static('uploads/portfolios'));
// app.use('/uploads/artikels', express.static('uploads/artikels'));
// app.use('/uploads/lokers', express.static('uploads/lokers'));
// app.use('/uploads/events', express.static('uploads/events'));

// app.use('/api/users', userRoutes);
// app.use('/api/portfolios', portfolioRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/project-designers', projectDesignerRoutes);
// app.use('/api/forums', forumRoutes);
// app.use('/api/comments', commentForumRoutes);
// app.use('/api/artikels', artikelRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/user-events', userEventRoutes);
// app.use('/api/lokers', lokerRoutes);
// app.use('/api/user-lokers', userLokerRoutes);
// app.use('/api/admin', adminRoutes); // Rute untuk admin

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); // Hanya satu userRoutes
const portfolioRoutes = require('./routes/portfolioRoutes');
const projectRoutes = require('./routes/projectRoutes');
const projectDesignerRoutes = require('./routes/projectDesignerRoutes');
const forumRoutes = require('./routes/forumRoutes');
const commentForumRoutes = require('./routes/commentForumRoutes');
const artikelRoutes = require('./routes/artikelRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userEventRoutes = require('./routes/userEventRoutes');
const lokerRoutes = require('./routes/lokerRoutes');
const userLokerRoutes = require('./routes/userLokerRoutes');

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173', // frontend lokal development Vite
  'http://localhost:4173',
  'https://ban-tu-project-frontend.vercel.app', // frontend production Vercel
  'https://bantuproojek.vercel.app',
  'https://bantu-proojek.com',
  'https://www.bantu-proojek.com',
  'https://your-frontend-railway-url.up.railway.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder untuk akses file upload profile pics & portfolio media
app.use('/uploads/profilePics', express.static('uploads/profilePics'));
app.use('/uploads/portfolios', express.static('uploads/portfolios'));
app.use('/uploads/artikels', express.static('uploads/artikels'));
app.use('/uploads/lokers', express.static('uploads/lokers'));
app.use('/uploads/events', express.static('uploads/events'));

// Semua rute terkait pengguna (termasuk admin) akan diakses melalui /api/users
app.use('/api/users', userRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-designers', projectDesignerRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/comments', commentForumRoutes);
app.use('/api/artikels', artikelRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/user-events', userEventRoutes);
app.use('/api/lokers', lokerRoutes);
app.use('/api/user-lokers', userLokerRoutes);

// Pastikan tidak ada lagi app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

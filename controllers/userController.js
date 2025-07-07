// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Portfolio = require('../models/Portfolio');
const Artikel = require('../models/Artikel');
const Event = require('../models/Event');
const Loker = require('../models/Loker');
const Forum = require('../models/Forum');

// Helper function untuk parsing JSON
const parseJsonField = (field, res, fieldName) => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      res
        .status(400)
        .json({ message: `Format JSON tidak valid untuk ${fieldName}.` });
      return null;
    }
  }
  return field;
};

// --- Fungsi Autentikasi & Registrasi ---

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    let { firstName, bio, subCategory } = req.body; // Field ini bisa undefined jika tidak dikirim
    const profilePicPath = req.file ? req.file.path : null; // Path file jika ada

    // Validasi dasar untuk semua peran
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        message: 'Nama pengguna, email, kata sandi, dan peran wajib diisi.',
      });
    }

    // Variabel untuk nilai akhir yang akan dimasukkan ke model User
    let finalFirstName = firstName;
    let finalBio = bio;
    let finalProfilePic = profilePicPath;
    let finalSubCategory = [];

    // Validasi dan penyesuaian field berdasarkan peran
    if (role === 'designer' || role === 'artisan') {
      if (!firstName) {
        return res.status(400).json({
          message: 'Untuk peran designer/artisan, nama depan wajib diisi.',
        });
      }
      if (!bio) {
        return res.status(400).json({
          message: 'Untuk peran designer/artisan, deskripsi wajib diisi.',
        });
      }
      if (!profilePicPath) {
        // Validasi profilePicPath
        return res.status(400).json({
          message: 'Untuk peran designer/artisan, foto profil wajib diisi.',
        });
      }

      // Validasi dan parsing subCategory hanya untuk designer
      if (role === 'designer') {
        if (!subCategory || JSON.parse(subCategory || '[]').length === 0) {
          return res
            .status(400)
            .json({ message: 'Untuk peran designer, kategori wajib diisi.' });
        }
        subCategory = parseJsonField(subCategory, res, 'subCategory');
        if (subCategory === null) return;
        if (!Array.isArray(subCategory)) {
          return res
            .status(400)
            .json({ message: 'Kategori harus berupa array.' });
        }
        finalSubCategory = subCategory; // Tetapkan ke finalSubCategory
      } else {
        // Jika artisan, subCategory tidak wajib
        finalSubCategory = [];
      }
    } else {
      // Jika role adalah 'admin'
      // Untuk admin, field-field ini harus undefined atau null agar tidak mengganggu model Mongoose
      finalFirstName = undefined;
      finalBio = undefined;
      finalProfilePic = undefined;
      finalSubCategory = [];
    }

    // Cek apakah email atau username sudah terdaftar
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Email atau Nama Pengguna sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName: finalFirstName,
      username,
      email,
      password: hashedPassword,
      role,
      bio: finalBio,
      profilePic: finalProfilePic,
      subCategory: finalSubCategory,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Registrasi berhasil!',
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
      },
      token,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res
      .status(500)
      .json({ message: error.message || 'Server error saat registrasi.' });
  }
};

exports.login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Email/Username atau Kata Sandi salah.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'Email/Username atau Kata Sandi salah.' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
    };

    res.json({
      message: 'Login berhasil!',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error saat login.' });
  }
};

// --- Fungsi User Biasa (Designer/Artisan) ---

exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId || !req.user.role) {
      console.error('Error: req.user is missing or incomplete.');
      return res.status(403).json({
        message:
          'Akses ditolak. Informasi pengguna tidak lengkap atau tidak valid.',
      });
    }

    if (req.user.role === 'admin') {
      return res
        .status(403)
        .json({ message: 'Admin tidak memiliki profil publik seperti ini.' });
    }

    const userId = req.user.userId;

    if (!userId || typeof userId !== 'string' || userId.length !== 24) {
      console.error('Error: Invalid userId format or value.', userId);
      return res.status(400).json({ message: 'ID pengguna tidak valid.' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      console.warn('User not found for ID:', userId);
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    const portfolios = await Portfolio.find({ creatorID: user._id });

    res.json({
      ...user.toObject(),
      portfolios,
    });
  } catch (error) {
    console.error('Error caught in getProfile:', error);
    res.status(500).json({ message: 'Server error saat mengambil profil.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (req.user.role === 'admin') {
      return res.status(403).json({
        message: 'Admin tidak bisa memperbarui profil dengan rute ini.',
      });
    }

    let { firstName, contactInfo, subCategory, bio, email } = req.body;

    if (email) {
      const userWithEmail = await User.findOne({ email });
      if (userWithEmail && userWithEmail._id.toString() !== userId) {
        return res.status(400).json({ message: 'Email sudah digunakan.' });
      }
    }

    contactInfo = parseJsonField(contactInfo, res, 'contactInfo');
    if (contactInfo === null) return;
    subCategory = parseJsonField(subCategory, res, 'subCategory');
    if (subCategory === null) return;
    if (subCategory && !Array.isArray(subCategory)) {
      return res
        .status(400)
        .json({ message: 'subCategory harus berupa array.' });
    }

    const updateFields = {};
    if (firstName !== undefined && firstName !== '')
      updateFields.firstName = firstName;
    if (bio !== undefined) updateFields.bio = bio;
    if (email !== undefined) updateFields.email = email;
    if (contactInfo !== undefined) updateFields.contactInfo = contactInfo;
    if (subCategory !== undefined) updateFields.subCategory = subCategory;

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      message: error.message || 'Server error saat memperbarui profil.',
    });
  }
};

exports.updateProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Gambar profil wajib diunggah.' });
    }
    if (req.user.role === 'admin') {
      return res.status(403).json({
        message: 'Admin tidak bisa memperbarui gambar profil dengan rute ini.',
      });
    }

    const profilePicUrl = req.file.path;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { profilePic: profilePicUrl },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({
      message: error.message || 'Server error saat memperbarui gambar profil.',
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user || user.role === 'admin') {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    const portfolios = await Portfolio.find({ creatorID: user._id });
    res.json({
      ...user.toObject(),
      portfolios,
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Error fetching user.' });
  }
};

// --- Fungsi Admin-Spesifik ---

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.userId).select('-password');
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin tidak ditemukan.' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Error getting admin profile:', error);
    res
      .status(500)
      .json({ message: 'Server error saat mengambil profil admin.' });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments({
      role: { $in: ['designer', 'artisan'] },
    });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const artikelCount = await Artikel.countDocuments();
    const forumsCount = await Forum.countDocuments();
    const portfolioCount = await Portfolio.countDocuments();
    const lokerCount = await Loker.countDocuments();
    const eventCount = await Event.countDocuments();

    res.json({
      totalUsers: userCount,
      totalAdmins: adminCount,
      articles: artikelCount,
      forums: forumsCount,
      portfolios: portfolioCount,
      lokers: lokerCount,
      events: eventCount,
    });
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ message: 'Error retrieving admin stats.' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ['designer', 'artisan'] },
    }).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching all users (admin):', error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { firstName, username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Semua bidang wajib diisi.' });
    }

    if (!['designer', 'artisan', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Peran yang tidak valid.' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'Nama Pengguna atau Email sudah ada.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      username,
      email,
      password: hashedPassword,
      role,
      // Bidang lain seperti bio, profilePic, subCategory tidak diisi di sini
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error adding user (admin):', error);
    res.status(500).json({ message: 'Gagal menambahkan pengguna.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    if (targetUser._id.toString() === req.user.userId.toString()) {
      return res.status(403).json({
        message:
          'Anda tidak dapat mengubah atau menghapus akun Anda sendiri melalui rute ini. Gunakan rute profil.',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user (admin):', error);
    res.status(500).json({ message: 'Error memperbarui pengguna.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    if (user._id.toString() === req.user.userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Anda tidak dapat menghapus akun Anda sendiri.' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pengguna berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting user (admin):', error);
    res.status(500).json({ message: 'Error menghapus pengguna.' });
  }
};

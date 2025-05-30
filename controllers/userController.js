const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Portfolio = require('../models/Portfolio');


exports.registerWithProfilePic = async (req, res) => {
  try {
    // Parsing JSON string fields from form-data
    let contactInfo = {};
    let subCategory = [];
    if (req.body.contactInfo) {
      try {
        contactInfo = JSON.parse(req.body.contactInfo);
      } catch {
        return res.status(400).json({ message: 'Invalid JSON in contactInfo' });
      }
    }
    if (req.body.subCategory) {
      try {
        subCategory = JSON.parse(req.body.subCategory);
        if (!Array.isArray(subCategory)) throw new Error();
      } catch {
        return res
          .status(400)
          .json({ message: 'subCategory must be a JSON array' });
      }
    }

    const { firstName, username, email, password, role } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Profile picture is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email Sudah Digunakan' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePicUrl = req.file.path;

    const user = new User({
      firstName,
      username,
      email,
      password: hashedPassword,
      role,
      contactInfo,
      subCategory,
      profilePic: profilePicUrl,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Email atau password salah' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Email atau password salah' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // console.log('getProfile called for user:', req.user);
    // Ambil user dan populate portofolio yang dibuat (relasi creatorID)
    const user = await User.findById(req.user).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Cari portofolio yang dibuat user
    const portfolios = await Portfolio.find({ creatorID: user._id });

    // Kirim data user + portofolio
    res.json({
      ...user.toObject(),
      portfolios, // tambahkan portofolio di response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Optional: bisa juga include portofolio user
    const portfolios = await Portfolio.find({ creatorID: user._id });
    res.json({
      ...user.toObject(),
      portfolios,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user;
    let { firstName, contactInfo, subCategory, bio, email } = req.body;

    // Validasi email unik saat update
    if (email) {
      const userWithEmail = await User.findOne({ email });
      if (userWithEmail && userWithEmail._id.toString() !== userId) {
        return res.status(400).json({ message: 'Email sudah digunakan' });
      }
    }

    // Parsing JSON jika berupa string
    if (typeof contactInfo === 'string') {
      try {
        contactInfo = JSON.parse(contactInfo);
      } catch {
        return res
          .status(400)
          .json({ message: 'Invalid JSON format for contactInfo' });
      }
    }
    if (typeof subCategory === 'string') {
      try {
        subCategory = JSON.parse(subCategory);
        if (!Array.isArray(subCategory)) {
          return res
            .status(400)
            .json({ message: 'subCategory must be an array' });
        }
      } catch {
        return res
          .status(400)
          .json({ message: 'Invalid JSON format for subCategory' });
      }
    }

    // Build objek update hanya field yang ada & tidak kosong
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

    if (!updatedUser)
      return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Profile picture is required' });
    }

    const profilePicUrl = req.file.path;

    const user = await User.findByIdAndUpdate(
      req.user,
      { profilePic: profilePicUrl },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
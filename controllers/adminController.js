const Admin = require('../models/Admin'); // Model Admin
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Artikel = require('../models/Artikel');
const Event = require('../models/Event');
const Project = require('../models/Project');
const Forum = require('../models/Forum');

// Register admin
exports.registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists)
      return res.status(400).json({ message: 'Email sudah digunakan' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();

    const token = jwt.sign(
      { adminId: newAdmin._id, role: newAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login admin
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin)
      return res.status(404).json({ message: 'Admin tidak ditemukan' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Password salah' });

    const token = jwt.sign(
      { adminId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get admin stats
exports.getAdminStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const artikelCount = await Artikel.countDocuments();
    const forumsCount = await Forum.countDocuments();
    const portfolioCount = await Portfolio.countDocuments();
    const projectCount = await Project.countDocuments();
    const eventCount = await Event.countDocuments();

    res.json({
      users: userCount,
      articles: artikelCount,
      forums: forumsCount,
      portfolios: portfolioCount,
      projects: projectCount,
      events: eventCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving admin stats' });
  }
};

// Get all users (for admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Add new user (admin)
exports.addUser = async (req, res) => {
  try {
    const { firstName, username, email, password, role } = req.body;
    if (!firstName || !username || !email || !password || !role)
      return res.status(400).json({ message: 'All fields are required' });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing)
      return res
        .status(400)
        .json({ message: 'Username or email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      username,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add user' });
  }
};

// Update user (admin)
exports.updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser)
      return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete user (admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Optional: Get admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.adminId).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

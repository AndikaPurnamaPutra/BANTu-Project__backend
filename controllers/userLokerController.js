const UserLoker = require('../models/UserLoker');
const Loker = require('../models/Loker');

exports.apply = async (req, res) => {
  try {
    const { lokerID } = req.body;
    const userID = req.user;

    // Check loker exists
    const loker = await Loker.findById(lokerID);
    if (!loker) return res.status(400).json({ message: 'Loker not found' });

    // Check if user already applied
    const existing = await UserLoker.findOne({ lokerID, userID });
    if (existing)
      return res
        .status(400)
        .json({ message: 'User already applied to this loker' });

    const application = new UserLoker({ lokerID, userID });
    await application.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplicationsByUser = async (req, res) => {
  try {
    const userID = req.params.userID;
    const applications = await UserLoker.find({ userID }).populate('lokerID');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplicantsByLoker = async (req, res) => {
  try {
    const lokerID = req.params.lokerID;
    const applicants = await UserLoker.find({ lokerID }).populate(
      'userID',
      '-password'
    );
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await UserLoker.findByIdAndDelete(id);
    if (!application)
      return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

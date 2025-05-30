const Event = require('../models/Event');

exports.create = async (req, res) => {
  try {
    const { title, subtitle, description, location, date, time, contact } =
      req.body;
    const createdBy = req.user;

    const thumbnail = req.files?.thumbnail ? req.files.thumbnail[0].path : null;
    const multimedia = req.files?.multimedia
      ? req.files.multimedia.map((file) => file.path)
      : [];

    const event = new Event({
      title,
      subtitle,
      description,
      location,
      date,
      time,
      contact,
      thumbnail,
      multimedia,
      createdBy,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', '-password')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'createdBy',
      '-password'
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.files?.thumbnail) {
      updateData.thumbnail = req.files.thumbnail[0].path;
    }

    if (req.files?.multimedia) {
      updateData.multimedia = req.files.multimedia.map((file) => file.path);
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

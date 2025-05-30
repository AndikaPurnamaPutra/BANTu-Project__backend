const UserEvent = require('../models/UserEvent');
const Event = require('../models/Event');

exports.joinEvent = async (req, res) => {
  try {
    const { eventID, status, role, notes } = req.body;
    const userID = req.user;

    const event = await Event.findById(eventID);
    if (!event) return res.status(400).json({ message: 'Event not found' });

    // Check if user already joined event
    const existing = await UserEvent.findOne({ eventID, userID });
    if (existing)
      return res.status(400).json({ message: 'User already joined this event' });

    const userEvent = new UserEvent({
      eventID,
      userID,
      status: status || undefined,
      role: role || undefined,
      notes: notes || '',
    });

    await userEvent.save();
    res.status(201).json(userEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventsByUser = async (req, res) => {
  try {
    const userID = req.params.userID;
    const events = await UserEvent.find({ userID }).populate('eventID');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsersByEvent = async (req, res) => {
  try {
    const eventID = req.params.eventID;
    const users = await UserEvent.find({ eventID }).populate('userID', '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.leaveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userEvent = await UserEvent.findByIdAndDelete(id);
    if (!userEvent)
      return res.status(404).json({ message: 'UserEvent not found' });
    res.json({ message: 'User left event' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

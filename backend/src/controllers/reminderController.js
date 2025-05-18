const Reminder = require('../models/Reminder');

const getReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const reminders = await Reminder.findByUser(userId);
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createReminder = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    const userId = req.user.id;
    const reminder = await Reminder.create({ user_id: userId, title, description, due_date });
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.update(id, req.body);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.delete(id);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.status(200).json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder
};
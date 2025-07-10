const ContactMessage = require('../models/contactMessage');

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    await ContactMessage.create({ name, email, subject, message });

    res.status(200).json({ message: 'Message saved successfully' });
  } catch (err) {
    console.error('Contact submission error:', err.message);
    res.status(500).json({ message: 'Failed to save message', error: err.message });
  }
};

module.exports = { submitContact };

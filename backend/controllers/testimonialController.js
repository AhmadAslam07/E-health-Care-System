const Testimonial = require('../models/testimonial');

// GET all testimonials using Sequelize
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      order: [['created_at', 'DESC']],
    });
    return res.json({ testimonials });
  } catch (err) {
    console.error("Sequelize fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch testimonials" });
  }
};

// POST a testimonial using Sequelize
exports.createTestimonial = async (req, res) => {
  const { name, comment, location } = req.body;

  if (!name || !comment) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    await Testimonial.create({ name, comment, location });
    return res.status(201).json({ message: 'Testimonial added successfully' });
  } catch (err) {
    console.error('Sequelize insert error:', err);
    return res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// controllers/paymentController.js
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');

const createCheckoutSession = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findByPk(appointmentId, {
      include: [{ model: Doctor }]
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const doctorName = appointment.Doctor?.name || "Doctor";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Appointment with Dr. ${doctorName}`
          },
          unit_amount: 1000,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/PatientDashboard/appointments`,
      cancel_url: `${process.env.FRONTEND_URL}/PatientDashboard/appointments`
    });

    // Simulate payment success immediately for test mode
    appointment.payment_status = 'paid';
    await appointment.save();

    res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("Stripe Error:", err.message);
    res.status(500).json({ message: 'Payment session error', error: err.message });
  }
};

const markAsPaid = async (req, res) => {
  const { appointment_id } = req.body;

  const appointment = await Appointment.findByPk(appointment_id);
  if (!appointment) return res.status(404).json({ message: "Appointment not found" });

  appointment.payment_status = 'paid';
  await appointment.save();

  res.json({ message: "Payment recorded" });
};

module.exports = {
  createCheckoutSession,
  markAsPaid
};
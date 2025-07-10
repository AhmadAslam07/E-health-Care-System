const express = require('express');
const router = express.Router();

router.get('/payfast/redirect/:appointmentId', (req, res) => {
  const appointmentId = req.params.appointmentId;
  const amountParam = parseFloat(req.query.amount);

  // Validate amount
  const amount = !isNaN(amountParam) && amountParam >= 1 ? amountParam.toFixed(2) : '500.00';

  const payFastData = {
    merchant_id: '10039072',
    merchant_key: 'z9gciim4wf5xc',
    return_url: `http://localhost:3000/payment-success?appointment_id=${appointmentId}`,
    cancel_url: `http://localhost:3000/payment-cancel`,
    notify_url: `${process.env.PAYFAST_NOTIFY_URL}/payfast/ipn`,
    amount: amount,
    item_name: 'Appointment Fee',
    custom_str1: appointmentId
  };

  const queryString = new URLSearchParams(payFastData).toString();
  const payFastUrl = `https://sandbox.payfast.co.za/eng/process?${queryString}`;

  res.redirect(payFastUrl);
});

module.exports = router;

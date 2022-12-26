const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  slot_time: String,
  slot_date: String,
  createdAt: {type: Date, default: Date.now()}
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;

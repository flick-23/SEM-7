const express = require('express');
const moment = require('moment')
const router = express.Router();
const Appointment = require('../../models/appointment');

//All routes have prefix /user/appointment

router.get('/book-appointment', (req, res) => {
  res.render('user/appointment/index', {
    user: req.user,
    date: '',
    slots: []
  })
})

router.post('/book-appointment', (req, res) => {
  let body = req.body;
  console.log(req.user);
  let newAppointment = new Appointment({
    name: body.name || req.user.name,
    email: body.email || req.user.email,
    phone: body.phone || req.user.phone,
    slot_date: body.slot_date,
    slot_time: body.slot_time
  })

  newAppointment.save((err, saved) => {
    Appointment.find({
        _id: saved._id
      })
      .exec((err, appointment) => {
        res.json(appointment)
      })
  })
})

router.post('/get-slots', (req, res) => {
  let date = req.body.date;
  let initSlots = ['10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '17:00', '17:30', '18:00']
  if (date == moment().format('D/M/YYYY')) {
    initSlots = initSlots.filter((hour, i, arr) => {
      return hour.slice(0, 2) > moment().hours()
    })
  }
  Appointment.find({
    slot_date: date
  }, 'slot_time -_id', (err, slots) => {
    let available = initSlots.filter((slot, i, arr) => {
      return slots.findIndex((x) => x.slot_time == slot) == -1
    })
    res.render('user/appointment/index', {
      user: req.user,
      date: date,
      slots: available
    });
  })
})

module.exports = router;
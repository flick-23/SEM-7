// User Portal Routes
const express = require('express');
const router = express.Router();
const passport = require('passport');
const ehrUser = require('../FabricHelperUser');
const twilioConfig = require('./twilioConfig');
const client = require('twilio')(twilioConfig.accountSid, twilioConfig.authToken)
const User = require('../models/user');
const axios = require('axios');


//SMS Functions
async function givePermission(number, doctorId) {
    User.findOne({
            phone: number
        }, (err, foundUser) => {
            if (err) {
                return false
            }
            let user = foundUser;
            user.permission.push(doctorId)
            user.save()
        })
        .then(() => {
            return true
        })
        .catch((err) => {
            return false
        })
}

async function revokePermission(number, doctorId) {
    User.findOne({
            phone: number
        }, (err, foundUser) => {
            if (err) {
                return false
            }
            let user = foundUser;
            let idx = user.permission.indexOf(doctorId);
            if (idx != -1) {
                user.permission.splice(idx, 1);
                user.save()
            } else {
                return false
            }
        })
        .then(() => {
            return true
        })
        .catch((err) => {
            return false
        })
}

async function sendReport(number) {
    User.findOne({
        phone: number
    }, (err, foundUser) => {
        if (err) {
            return false
        }
        const aadhaarNo = foundUser._id
        const doc = {
            'medicalID': aadhaarNo,
            'sms': true
        }
        const result = await (ehrUser.getReport(doc));
        if (result) {
            client.messages
                .create({
                    body: 'Medical Report as follows' + result,
                    from: twilioConfig.from,
                    to: number
                })
                .then((message) => console.log(message.sid))
                .catch((err) => console.log(err))
        }
    })
}

async function sendGiveSuccessSMS(number) {
    client.messages
        .create({
            body: 'Successfully granted permission!',
            from: twilioConfig.from,
            to: number
        })
        .then((message) => console.log(message.sid))
        .catch((err) => console.log(err))
}
async function sendRevokeSuccessSMS(number) {
    client.messages
        .create({
            body: 'Successfully revoked permission!',
            from: twilioConfig.from,
            to: number
        })
        .then((message) => console.log(message.sid))
        .catch((err) => console.log(err))
}

async function sendFailureSMS(number) {
    client.messages
        .create({
            body: 'Oops something went wrong! Try again later',
            from: twilioConfig.from,
            to: number
        })
}

async function sendSMS(number, operation) {
    if (operation == 'give' || operation == 'GIVE' || operation == 'Give') {
        sendGiveSuccessSMS(number)
    } else if (operation == 'revoke' || operation == 'Revoke' || operation == 'REVOKE') {
        sendRevokeSuccessSMS(number)
    } else {
        console.log('Something failed')
    }
}


router.post('/', async (req, res) => {
    const number = req.body.From
    const messageBody = req.body.Body
    if (messageBody != 'GET REPORT' || messageBody != 'get report' || messageBody != 'Get Report') {
        const messageSplit = messageBody.split(' ')
        const doctorId = messageSplit[0]
        const operation = messageSplit[1]
        if (operation == 'give' || operation == 'GIVE' || operation == 'Give') {
            const response = await givePermission(number, doctorId)
            //if (response) {
                sendSMS(number, operation)
            //}
        } else if (operation == 'revoke' || operation == 'Revoke' || operation == 'REVOKE') {
            const response = await revokePermission(number, doctorId)
            //if (response) {
                sendSMS(number, operation)
            //}
        } else {
            sendFailureSMS(number)
        }
    } else if (messageBody == 'GET REPORT' || messageBody == 'get report' || messageBody == 'Get Report') {
        sendReport(number)
    }
})

module.exports = router;
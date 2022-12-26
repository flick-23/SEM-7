const mongoose = require('mongoose');
const passGen = require('password-generator');

let OrgSchema = mongoose.Schema({
    _id: {
        type: String,
        default: passGen(10, false, /\d/)
    },
    name: String,
    state: String,
    district: String,
    location: String,
    pin: String,
    phone: String,
    mobile: String,
    email: String,
    regNo: String,
    regFile: String,
    accepted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Organisation', OrgSchema);
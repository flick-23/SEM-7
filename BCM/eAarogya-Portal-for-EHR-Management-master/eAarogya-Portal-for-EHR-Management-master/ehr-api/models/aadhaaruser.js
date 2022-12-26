const mongoose = require('mongoose');

let AadhaarSchema =  mongoose.Schema({
        aadhaarNo: String,
        name: String,
        dob: String,
        gender: String,
        address: String,
        phoneNumber: String
});

module.exports = mongoose.model('AadhaarUser', AadhaarSchema);

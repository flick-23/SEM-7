const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    state: String,
    disease: String
})

module.exports = mongoose.model('Data', DataSchema);
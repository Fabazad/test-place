const mongoose = require('mongoose');

var stepSchema = new mongoose.Schema({
});

module.exports = mongoose.model('Step', stepSchema);
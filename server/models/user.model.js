const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {ROLES, GENDERS} = require("../helpers/constants");

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emailValidation: { type: Boolean, default: false},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    amazonId: { type: String, unique: true, sparse: true },
    testerMessage: String,
    sellerMessage: String,
    roles: { type: [String], enum: Object.values(ROLES), default: [] },
    paypalEmail: String,
    lastLogin: Date,
    createdAt: {type: Date, default: new Date(), required: true},
    gender: { type: String, default: GENDERS.MALE, enum: Object.values(GENDERS) }
});

UserSchema.pre('save', function(next) {
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified('password')) {
      // Saving reference to this because of changing scopes
      const document = this;
      bcrypt.hash(document.password, saltRounds,
        function(err, hashedPassword) {
        if (err) {
          next(err);
        }
        else {
          document.password = hashedPassword;
          next();
        }
      });
    } else {
      next();
    }
});

UserSchema.methods.isCorrectPassword = function(password, callback){
    bcrypt.compare(password, this.password, function(err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
};

UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', UserSchema);

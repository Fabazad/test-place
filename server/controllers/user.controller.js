const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';
const axios = require('axios');
const randomToken = require('random-token');
const moment = require("moment");
const EmailController = require('../controllers/email.controller');
require('dotenv').config();

class StepController {

    static async register(email, password, role, captcha) {
        return new Promise ((resolve, reject) => {
            if (password.length < 8) {
                reject({ status: 400, message: "The password is too short." });
            }
            const secret = process.env.SECRET_RECAPTCHA;
            axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}`)
            .then(response => {
                if (response.data.success) {
                    const user = new UserModel({ email, password, role });
                    user.save(function(err) {
                        if (err) {
                            reject({ status: 500, message: "Error registering new user please try again." });
                        } else {
                            EmailController.sendValidateMailAddressMail(email, user._id)
                                .then(() => resolve({user}))
                                .catch(reject);
                        }
                    });
                }
                else {
                    reject({ status: 401, message: "ReCAPTCHA failed."})
                }
            })
            .catch(error => {
                reject({ status: 500, message: "Internal error please try again"});
            });
            
        });
    }

    static async login(email, password) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function(err, user) {
                if (err) {
                    reject({ status: 500, message: "Internal error please try again"});
                } else if (!user) {
                    reject({ status: 401, message: "Incorrect email or password"});
                } else if (!user.emailValidation) {
                    reject({ status: 401, message: "The email needs to be validate before."});
                } else {
                    user.isCorrectPassword(password, function(err, same) {
                        if (err) {
                            reject({ status: 500, message: "Internal error please try again"});
                        } else if (!same) {
                            reject({ status: 401, message: "Incorrect email or password"});
                        } else {
                            // Issue token
                            const payload = { userId: user._id, role: user.role };
                            const token = jwt.sign(payload, secret, { expiresIn: '1h' });
                            resolve({user, token});
                        }
                    });
                }
            });
        });
    }

    static async resetPasswordMail(email) {
        return new Promise((resolve, reject) => {
            if (!email) {
                reject({ status: 400, message: "Missing email."});
            }
            const resetPasswordToken = randomToken(16);
            const tokenMoment = (new moment()).add(15, "minutes");
            const resetPasswordExpires = tokenMoment.toDate();
            UserModel.findOneAndUpdate({email}, { $set: { resetPasswordToken, resetPasswordExpires } }, { new: true })
                .then(user => {
                    if (!user) {
                        return reject({ status: 400, message: "No user with this email found."})
                    }
                    EmailController.sendResetPasswordMail(email, resetPasswordToken)
                        .then(() => resolve({user})).catch(err => reject({status: 500, message: err}));
                })
                .catch(err => reject({status: 500, message: err}));
        });
    }

    static async resetPassword(password, resetPasswordToken) {
        return new Promise((resolve, reject) => {
            if (password.length < 8) {
                return reject({ status: 400, message: "Password too short."});
            }
            if (!resetPasswordToken) {
                return reject({ status: 400, message: "Missing token."});
            }
            UserModel.findOne({resetPasswordToken, resetPasswordExpires: { $gte: new Date() } })
                .then(user => {
                    if (!user) {
                        return reject({ status: 403, message: "Wrong or expired token."});
                    }
                    user.password = password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save((err) => {
                        if (err) {
                            reject({ status: 500, message: "Error updating password's user, please try again." });
                        }
                        else {
                            resolve({user});
                        }
                    });
                })
                .catch(err => reject({status: 500, message: err}));
        });
    }

    static async updatePassword(previousPassword, password, userId) {
        return new Promise((resolve, reject) => {
            if (password.length < 8) {
                return reject({ status: 400, message: "Password too short."});
            }
            if (!userId) {
                return reject({ status: 400, message: "Missing user token."});
            }
            UserModel.findById(userId)
                .then(user => {
                    if (!user) {
                        return reject({ status: 403, message: "Wrong user token."});
                    }
                    user.isCorrectPassword(previousPassword, (err, same) => {
                        if (err) {
                            reject({ status: 500, message: "Internal error please try again."});
                        } else if (!same) {
                            reject({ status: 401, message: "Incorrect current password."});
                        } else {
                            // Issue token
                            user.password = password;
                            user.save(() => {
                                resolve({user});
                            });
                        }
                    });
                    user.password = password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save((err) => {
                        if (err) {
                            reject({ status: 500, message: "Error updating password's user, please try again." });
                        }
                        else {
                            resolve({user});
                        }
                    });
                })
                .catch(err => reject({status: 500, message: err}));
        });
    }

    static async emailValidation(userId) {
        return new Promise((resolve, reject) => {
            if (!userId) {
                return reject({ status: 400, message: "Missing token."});
            }
            UserModel.findByIdAndUpdate(userId, { $set: { emailValidation: true } })
                .then(user => {
                    if (!user) {
                        return reject({ status: 403, message: "Wrong token."});
                    }
                    resolve({user});
                })
                .catch(err => reject({status: 500, message: err}));
        });
    }

    static async amazonLogin(userId, token) {
        return new Promise((resolve, reject) => {
            if (!userId) {
                return reject({ status: 403, message: "Wrong user token."});
            }
            if (!token) {
                return reject({ status: 400, message: "Missing token."});
            }
            axios.get("https://api.amazon.com/user/profile?access_token=" + token ).then(res => {
                UserModel.findByIdAndUpdate(userId, {amazonId: res.data.user_id}).then(resolve)
                    .catch(err => reject({status: 500, message: err}));
            }).catch(err => reject({status: 403, message: "Wrong token."}));
        });
    }
}

module.exports = StepController;
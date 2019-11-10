const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';

class StepController {

    static async register(name, email, password) {
        return new Promise ((resolve, reject) => {
            const user = new UserModel({name, email, password});
            user.save(function(err) {
                if (err) {
                    reject({ status: 500, message: "Error registering new user please try again." });
                } else {
                    resolve();
                }
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
                } else {
                    user.isCorrectPassword(password, function(err, same) {
                        if (err) {
                            reject({ status: 500, message: "Internal error please try again"});
                        } else if (!same) {
                            reject({ status: 401, message: "Incorrect email or password"});
                        } else {
                            // Issue token
                            const payload = { email };
                            const token = jwt.sign(payload, secret, {
                                expiresIn: '1h'
                            });
                            resolve(token);
                        }
                    });
                }
            });
        });
    }
}

module.exports = StepController;
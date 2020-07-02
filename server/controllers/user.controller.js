const UserModel = require('../models/user.model');
const TestModel = require('../models/test.model');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const randomToken = require('random-token');
const moment = require("moment");
const ErrorResponses = require("../helpers/ErrorResponses");
const EmailController = require('../controllers/email.controller');
require('dotenv').config();
const secret = process.env.JWT_KEY;
const {ROLES, TEST_STATUSES, MAIL_TEMPLATES_IDS} = require('../helpers/constants');
const TestController = require('../controllers/test.controller');
const constants = require('../helpers/constants');
const {GLOBAL_TEST_STATUSES} = constants;

const createToken = (user, time) => {
    const payload = {userId: user._id, amazonId: user.amazonId, roles: user.roles};
    return jwt.sign(payload, secret, {expiresIn: time});
};

class UserController {

    static async register(roles, name, email, password, captcha) {
        return new Promise((resolve, reject) => {
            if (!name || !roles.length || !Object.keys(ROLES).includes(roles[0]) || !email) {
                reject({status: 400, message: "Missing fields."});
            }

            if (password.length < 8) {
                reject({status: 400, message: "The password is too short."});
            }

            const secret = process.env.SECRET_RECAPTCHA;
            axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}`)
                .then(response => {
                    if (response.data.success) {
                        const user = new UserModel({name, email, password, roles});
                        user.save(function (err) {
                            if (err) {
                                reject(ErrorResponses.mongoose(err));
                            } else {
                                EmailController.sendValidateMailAddressMail(email, user._id)
                                    .then(() => resolve(user))
                                    .catch(reject);
                            }
                        });
                    } else {
                        reject({status: 400, message: "ReCAPTCHA failed."})
                    }
                })
                .catch(error => {
                    reject({status: 500, message: "Internal error please try again"});
                });

        });
    }

    static async login(email, password, keepConnection) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({email}, function (err, user) {
                if (err) {
                    reject(ErrorResponses.mongoose(err));
                } else if (!user) {
                    reject({status: 400, message: "Incorrect email or password"});
                } else if (!user.emailValidation) {
                    reject({status: 400, message: "The email needs to be validate before."});
                } else {
                    user.isCorrectPassword(password, async function (err, same) {
                        if (err) {
                            reject(ErrorResponses.mongoose(err));
                        } else if (!same) {
                            reject({status: 400, message: "Incorrect email or password"});
                        } else {
                            // Issue token
                            const token = createToken(user, keepConnection ? '7d' : '1h');

                            const [newUser, requestedTestsCount, processingTestsCount, completedTestsCount, cancelledTestsCount] = await Promise.all([
                                UserModel.findByIdAndUpdate(user._id, {lastLogin: new Date()}),
                                TestController.countTestWithStatues(user._id, GLOBAL_TEST_STATUSES.REQUESTED),
                                TestController.countTestWithStatues(user._id, GLOBAL_TEST_STATUSES.PROCESSING),
                                TestController.countTestWithStatues(user._id, GLOBAL_TEST_STATUSES.COMPLETED),
                                TestController.countTestWithStatues(user._id, GLOBAL_TEST_STATUSES.CANCELLED)
                            ]);
                            resolve({user: newUser, token, requestedTestsCount, processingTestsCount, completedTestsCount, cancelledTestsCount});
                        }
                    });
                }
            });
        });
    }

    static async resetPasswordMail(email) {
        return new Promise((resolve, reject) => {
            if (!email) {
                reject({status: 400, message: "Missing email."});
            }
            const resetPasswordToken = randomToken(16);
            const tokenMoment = (new moment()).add(15, "minutes");
            const resetPasswordExpires = tokenMoment.toDate();
            UserModel.findOneAndUpdate({email}, {$set: {resetPasswordToken, resetPasswordExpires}}, {new: true})
                .then(user => {
                    if (!user) {
                        return reject({status: 400, message: "No user with this email found."})
                    }
                    EmailController.sendResetPasswordMail(email, resetPasswordToken)
                        .then(() => resolve({user})).catch(err => reject({status: 500, message: err}));
                })
                .catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }

    static async resetPassword(password, resetPasswordToken) {
        return new Promise((resolve, reject) => {
            if (password.length < 8) {
                return reject({status: 400, message: "Password too short."});
            }
            if (!resetPasswordToken) {
                return reject({status: 400, message: "Missing token."});
            }
            UserModel.findOne({resetPasswordToken, resetPasswordExpires: {$gte: new Date()}})
                .then(user => {
                    if (!user) {
                        return reject({status: 403, message: "Wrong or expired token."});
                    }
                    user.password = password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save((err) => {
                        if (err) {
                            reject(ErrorResponses.mongoose(err));
                        } else {
                            resolve({user});
                        }
                    });
                })
                .catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }

    static async updatePassword(previousPassword, password, userId) {
        return new Promise((resolve, reject) => {
            if (password.length < 8) {
                return reject({status: 400, message: "Password too short."});
            }
            if (!userId) {
                return reject({status: 400, message: "Missing user token."});
            }
            UserModel.findById(userId)
                .then(user => {
                    if (!user) {
                        return reject({status: 403, message: "Wrong user token."});
                    }
                    user.isCorrectPassword(previousPassword, (err, same) => {
                        if (err) {
                            reject({status: 500, message: "Internal error please try again."});
                        } else if (!same) {
                            reject({status: 401, message: "Incorrect current password."});
                        } else {
                            // Issue token
                            user.password = password;
                            user.resetPasswordToken = undefined;
                            user.resetPasswordExpires = undefined;
                            user.save()
                                .then(user => {
                                    const token = createToken(user, '1h');
                                    resolve({user, token});
                                })
                                .catch(err => reject(ErrorResponses.mongoose(err)));
                        }
                    });
                })
                .catch(err => reject({status: 500, message: err}));
        });
    }

    static async emailValidation(userId) {
        return new Promise((resolve, reject) => {
            if (!userId) {
                return reject({status: 400, message: "Missing token."});
            }
            UserModel.findByIdAndUpdate(userId, {$set: {emailValidation: true}})
                .then(user => {
                    if (!user) {
                        return reject({status: 403, message: "Wrong token."});
                    }
                    resolve({user});
                })
                .catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }

    static async validationMail(email) {
        return new Promise((resolve, reject) => {
            if (!email) {
                reject({status: 400, message: "Missing email."});
            }
            UserModel.findOne({email})
                .then(user => {
                    if (!user) {
                        return reject({status: 400, message: "No user with this email found."});
                    }
                    if (user.emailValidation) {
                        return reject({status: 403, message: "Email already validated."});
                    }
                    EmailController.sendValidateMailAddressMail(email, user._id.toString())
                        .then(() => resolve({user})).catch(err => reject({status: 500, message: err}));
                })
                .catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }

    static async updateUserInfo(currentUserId, currentUserAmazonId, currentUserRoles, userId, data) {
        return new Promise(async (resolve, reject) => {
            if (currentUserId !== userId && !currentUserRoles.includes(ROLES.ADMIN)) {
                return reject({status: 403, message: "Unauthorized"});
            }

            if ('roles' in data) {
                if (currentUserRoles.includes(ROLES.TESTER) && !data.roles.includes(ROLES.TESTER)) {
                    const processingTestNumber = await TestModel.count({
                        status: {
                            $in: [
                                TEST_STATUSES.requested,
                                TEST_STATUSES.requestAccepted,
                                TEST_STATUSES.productOrdered,
                                TEST_STATUSES.productReceived,
                                TEST_STATUSES.productReviewed,
                                TEST_STATUSES.reviewValidated
                                //TODO complete
                            ]
                        },
                        tester: currentUserId
                    });

                    if (processingTestNumber) {
                        return reject({
                            status: 403,
                            message: "You have to stay tester until you finish to precess all your tests."
                        });
                    }
                }

                if (currentUserRoles.includes(ROLES.SELLER) && !data.roles.includes(ROLES.SELLER)) {
                    const processingTestNumber = await TestModel.count({
                        status: {
                            $in: [
                                TEST_STATUSES.requested,
                                TEST_STATUSES.requestAccepted,
                                TEST_STATUSES.productOrdered,
                                TEST_STATUSES.productReceived,
                                TEST_STATUSES.productReviewed,
                                TEST_STATUSES.reviewValidated
                                //TODO complete
                            ]
                        },
                        seller: currentUserId
                    });

                    if (processingTestNumber) {
                        return reject({
                            status: 403,
                            message: "You have to stay tester until you finish to precess all your tests."
                        });
                    }
                }
            }

            const authorizedData = ['testerMessage', 'sellerMessage', 'roles', 'paypalEmail', 'amazonId'];
            Object.keys(data).forEach(key => {
                if (!authorizedData.includes(key)) delete data[key];
                if (['paypalEmail', 'amazonId'].includes(key) && !data[key]) {
                    return reject({status: 400, message: "Can't remove paypalEmail or Amazon Id."});
                }
            });

            UserModel.findByIdAndUpdate(userId, data, {new: true})
                .then(user => {
                    const token = createToken(user, '1h');
                    resolve({user, token});
                })
                .catch(err => reject(ErrorResponses.mongoose(err)));
        });
    }

    static async checkToken(logged, decoded) {
        if (!decoded || !decoded.userId) {
            return ({user: null, check: false});
        } else if (!logged || logged === "false") {
            try {
                const [user, requestedTestsCount, processingTestsCount, completedTestsCount, cancelledTestsCount] = await Promise.all([
                    UserModel.findById(decoded.userId),
                    TestController.countTestWithStatues(decoded.userId, GLOBAL_TEST_STATUSES.REQUESTED),
                    TestController.countTestWithStatues(decoded.userId, GLOBAL_TEST_STATUSES.PROCESSING),
                    TestController.countTestWithStatues(decoded.userId, GLOBAL_TEST_STATUSES.COMPLETED),
                    TestController.countTestWithStatues(decoded.userId, GLOBAL_TEST_STATUSES.CANCELLED)
                ]);

                return {user, requestedTestsCount, processingTestsCount, completedTestsCount, cancelledTestsCount, check: true};
            } catch (e) {
                return Promise.reject(ErrorResponses.mongoose(e));
            }
        } else {
            return {check: true};
        }
    }

    static async sendContactUsEmail(name, email, message) {
        if (!name || !email || !message) {
            return Promise.reject({status: 400, message: "Missing fields."});
        }

        return EmailController.sendEmail("fabien.turgut@gmail.com", email, MAIL_TEMPLATES_IDS.CONTACT_US, {
            name: name,
            message: message
        });
    }

    static async changeGender(userId, gender) {
        if (!userId || !gender) {
            return Promise.reject({status: 400, message: "Missing fields."});
        }

        try {
            const user = await UserModel.findByIdAndUpdate(userId, {gender}, {new: true});
            return {user};
        } catch (err) {
            return Promise.reject(ErrorResponses.mongoose(err));
        }
    }

    static async getOne(userId) {
        if (!userId) {
            return Promise.reject({status: 400, message: "Missing userId."});
        }

        try {
            const [user, processingTestsCount, completedTestsCount, cancelledTestsCount] = await Promise.all([
                UserModel.findById(userId),
                TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.PROCESSING),
                TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.COMPLETED),
                TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.CANCELLED)
            ]);
            return {user, processingTestsCount, completedTestsCount, cancelledTestsCount};
        } catch (e) {
            return Promise.reject(ErrorResponses.mongoose(e));
        }
    }
}

module.exports = UserController;
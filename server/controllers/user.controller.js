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
const {GLOBAL_TEST_STATUSES, FROM_MAIL_ADDRESS, CERTIFIED_RATIO} = constants;

const createToken = (user, time) => {
    const payload = {userId: user._id, amazonId: user.amazonId, roles: user.roles};
    return jwt.sign(payload, secret, {expiresIn: time});
};

class UserController {

    static async credentialRegister(roles, name, email, password, language) {
        return new Promise((resolve, reject) => {
            if (!name || !roles.length || !Object.keys(ROLES).includes(roles[0]) || !email) {
                reject({status: 400, message: "Missing fields."});
            }

            if (password.length < 8) {
                reject({status: 400, message: "The password is too short."});
            }

            const user = new UserModel({name, email, password, roles, language});
            user.save(function (err) {
                if (err) {
                    reject(ErrorResponses.mongoose(err));
                } else {
                    EmailController.sendValidateMailAddressMail(email, user._id, user.language)
                        .then(() => resolve(user))
                        .catch(reject);
                }
            })
        })
    }

    static async login(user, keepConnection) {
        const token = createToken(user, keepConnection ? '7d' : '1h');

        const [newUser, requestedTestsCount, processingTestsCount, completedTestsCount, cancelledTestsCount, guiltyTestsCount] = await Promise.all([
            UserModel.findByIdAndUpdate(user._id, {lastLogin: new Date()}),
            TestController.countTestWithStatues(user._id, GLOBAL_TEST_STATUSES.REQUESTED),
            TestController.countTestWithStatues(user._id, GLOBAL_TEST_STATUSES.PROCESSING),
            TestController.countTestWithStatues(user._id, GLOBAL_TEST_STATUSES.COMPLETED),
            TestController.countTestWithStatues(user._id, GLOBAL_TEST_STATUSES.CANCELLED),
            TestController.countTestWithStatues(user._id, GLOBAL_TEST_STATUSES.CANCELLED, true)
        ]);

        return {
            user: newUser,
            token,
            requestedTestsCount,
            processingTestsCount,
            completedTestsCount,
            cancelledTestsCount,
            guiltyTestsCount
        };
    }

    static async credentialLogin(email, password, keepConnection) {
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
                            UserController.login(user, keepConnection).then(resolve)
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
                    EmailController.sendResetPasswordMail(email, resetPasswordToken, user.language || 'fr')
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
                            reject({status: 400, message: "Incorrect current password."});
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

            const authorizedData = ['testerMessage', 'sellerMessage', 'roles', 'paypalEmail', 'amazonId', 'name'];
            Object.keys(data).forEach(key => {
                if (!authorizedData.includes(key)) delete data[key];
                if (['paypalEmail', 'amazonId'].includes(key) && !data[key]) {
                    return reject({status: 400, message: "Can't remove paypalEmail or Amazon Id."});
                }
            });

            if ('name' in data) {
                const countWithName = await UserModel.count({name: data.name});
                if (countWithName > 0) return reject({status: 400, message: 'name_already_used'});
            }

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
        }
        if (!logged || logged === "false") {
            try {
                const [user, requestedTestsCount, processingTestsCount, completedTestsCount, cancelledTestsCount, guiltyTestsCount] = await Promise.all([
                    UserModel.findById(decoded.userId),
                    TestController.countTestWithStatues(decoded.userId, GLOBAL_TEST_STATUSES.REQUESTED),
                    TestController.countTestWithStatues(decoded.userId, GLOBAL_TEST_STATUSES.PROCESSING),
                    TestController.countTestWithStatues(decoded.userId, GLOBAL_TEST_STATUSES.COMPLETED),
                    TestController.countTestWithStatues(decoded.userId, GLOBAL_TEST_STATUSES.CANCELLED),
                    TestController.countTestWithStatues(decoded.userId, GLOBAL_TEST_STATUSES.CANCELLED, true)
                ]);

                return {
                    user,
                    requestedTestsCount,
                    processingTestsCount,
                    completedTestsCount,
                    cancelledTestsCount,
                    guiltyTestsCount,
                    check: true
                };
            } catch (e) {
                return Promise.reject(ErrorResponses.mongoose(e));
            }
        }
        return {check: true};

    }

    static async sendContactUsEmail(name, email, message) {
        if (!name || !email || !message) {
            return Promise.reject({status: 400, message: "Missing fields."});
        }

        return EmailController.sendEmail(FROM_MAIL_ADDRESS, email, MAIL_TEMPLATES_IDS.CONTACT_US['fr'], {
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
            const [user, processingTestsCount, completedTestsCount, guiltyTestsCount] = await Promise.all([
                UserModel.findById(userId),
                TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.PROCESSING),
                TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.COMPLETED),
                TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.CANCELLED, true)
            ]);
            return {
                user: {
                    createdAt: user.createdAt,
                    email: user.email,
                    gender: user.gender,
                    name: user.name,
                    roles: user.roles,
                    sellerMessage: user.sellerMessage,
                    _id: user._id
                }, processingTestsCount, completedTestsCount, guiltyTestsCount
            };
        } catch (e) {
            return Promise.reject(ErrorResponses.mongoose(e));
        }
    }

    static async googleRegister(params) {
        const {email, name, roles, googleId, language} = params;

        const googleUser = await UserModel.findOne({googleId});
        if (googleUser) return UserController.login(googleUser, false);

        const emailUser = await UserModel.findOne({email});
        if (emailUser) {
            const newUser = await UserModel.updateOne({_id: emailUser._id}, {$set: {googleId}});
            return UserController.login(newUser, false);
        }

        const user = await UserModel.findOne({name});
        if (user) return Promise.reject({status: 400, message: 'name_already_used'});

        try {
            const newUser = await UserModel.create({email, name, roles, googleId, emailValidation: true, language});
            return UserController.login(newUser, false)
        } catch (e) {
            return Promise.reject({status: 500, message: e.message});
        }
    }

    static async googleLogin(params) {
        const {googleId, keepConnection} = params;
        const user = await UserModel.findOne({googleId});
        if (user) return UserController.login(user, keepConnection);
        return Promise.reject({status: 403, message: "not_registered_yet"});
    }


    static async facebookRegister({accessToken, roles, language}) {
        try {
            const response = await axios.get('https://graph.facebook.com/v11.0/me', {
                params: {
                    access_token: accessToken,
                    fields: "id,name,email,first_name"
                }
            });

            const {id, name, email, first_name} = response.data;

            const facebookUser = await UserModel.findOne({facebookId: id});
            if (facebookUser) return UserController.login(facebookUser, false);

            if (!email) return Promise.reject({status: 403, message: "facebook_account_missing_email"});

            const emailUser = await UserModel.findOne({email});
            if (emailUser) {
                const newUser = await UserModel.updateOne({_id: emailUser._id}, {$set: {facebookId: id}});
                return UserController.login(newUser, false);
            }

            const userName = first_name ? first_name + Math.round((Math.random() * 10000)).toString() : name;

            const user = await UserModel.findOne({name: userName});
            if (user) return Promise.reject({status: 400, message: 'name_already_used'});

            const newUser = await UserModel.create({
                email,
                name: userName,
                roles,
                facebookId: id,
                emailValidation: true,
                language
            });
            return UserController.login(newUser, false)
        } catch (e) {
            return Promise.reject({status: 500, message: e.message});
        }
    }

    static async facebookLogin({accessToken, keepConnection}) {
        try {
            const {data} = await axios.get('https://graph.facebook.com/v11.0/me', {
                params: {
                    access_token: accessToken,
                    fields: "id,name,email,first_name"
                }
            });

            const user = await UserModel.findOne({facebookId: data.id});
            if (!user) return Promise.reject({status: 403, message: "not_registered_yet"});
            return UserController.login(user, keepConnection)
        } catch (e) {
            return Promise.reject({status: 500, message: e.message});
        }
    }

    static async updateLanguage(userId, language) {
        try {
            const user = await UserModel.findByIdAndUpdate(userId, {language}, {new: true});
            return {user};
        } catch (err) {
            return Promise.reject(ErrorResponses.mongoose(err));
        }
    }

    static async checkAndUpdateUserCertification(userId) {
        try {
            const [completedTestsCount, cancelledTestsCount, user] = await Promise.all([
                TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.COMPLETED),
                TestController.countTestWithStatues(userId, GLOBAL_TEST_STATUSES.CANCELLED, true),
                UserModel.findOne({_id: userId})
            ]);

            const isCertified = completedTestsCount * CERTIFIED_RATIO >= cancelledTestsCount;
            if (user.isCertified === isCertified) return user;
            const newUser = await UserModel.updateOne({_id: user._id}, {$set: {isCertified}});
            return newUser;
        } catch (err) {
            return Promise.reject(ErrorResponses.mongoose(err));
        }
    }
}

module.exports = UserController;
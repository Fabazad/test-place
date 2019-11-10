const UserModel = require('../models/user.model');

class StepController {

    static async register(user) {
        const user = new User(user);
        user.save(function(err) {
            if (err) {
                return ("Error registering new user please try again.");
            } else {
                return("Welcome to the club!");
            }
        });
    }

    static async login(email, password) {
        UserModel.findOne({ email }, function(err, user) {
            if (err) {
              console.error(err);
              //res.status(500).json({error: 'Internal error please try again'});
            } else if (!user) {
                console.error('Incorrect email or password');
              //res.status(401).json({error: 'Incorrect email or password'});
            } else {
                user.isCorrectPassword(password, function(err, same) {
                    if (err) {
                        console.error('Internal error please try again');
                        //res.status(500).json({error: 'Internal error please try again'});
                    } else if (!same) {
                        console.error('Incorrect email or password');
                        //res.status(401).json({error: 'Incorrect email or password'});
                    } else {
                        // Issue token
                        const payload = { email };
                        const token = jwt.sign(payload, secret, {
                            expiresIn: '1h'
                        });
                        return token;
                    }
                });
            }
          });
    }
}

module.exports = StepController;
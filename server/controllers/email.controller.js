const helper = require('sendgrid').mail;
const constants = require("../helpers/constants");
require('dotenv').config();

const from_email = new helper.Email(constants.FROM_MAIL_ADDRESS);
const senfGrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

class EmailController {

  static async sendEmail(body) {
    return new Promise((resolve, reject) => {
      var request = senfGrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: body,
      });
      
      senfGrid.API(request, function(error, response) {
        if (response.statusCode === 202) {
          resolve();
        }
        else {
          reject({ eroor:500, error});
        }
      });
    })
  }

  static async sendResetPasswordMail(email, resetPasswordToken) {
    const to_email = new helper.Email(email);
    const personalization = new helper.Personalization();
    personalization.addTo(to_email);

    const mail = new helper.Mail();
    mail.setFrom(from_email);
    mail.addPersonalization(personalization);
    mail.setTemplateId(constants.MAIL_TEMPLATES_IDS.RESET_PASSWORD);
    const jsonMail = mail.toJSON();
    const baseUrl = process.env.NODE_ENV === 'development' ? constants.FRONTEND_LOCAL_URL : constants.FRONTEND_URL;
    jsonMail.personalizations[0].dynamic_template_data = { resetPasswordToken, baseUrl };
    return this.sendEmail(jsonMail);
  }

}

module.exports = EmailController;
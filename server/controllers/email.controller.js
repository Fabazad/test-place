const helper = require('sendgrid').mail;
const constants = require("../helpers/constants");
require('dotenv').config();

const from_email = constants.FROM_MAIL_ADDRESS;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const senfGrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

class EmailController {

  static async sendEmailFromJson(body) {
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
          reject({ status: 500, message: error});
        }
      });
    })
  }

  static async sendEmail(toEmail, fromEmail, templateId, vars) {
    sgMail.setSubstitutionWrappers('{{', '}}');
    await sgMail.send({
      to: toEmail,
      from: fromEmail,
      template_id: templateId,
      dynamicTemplateData: vars
    });
    return Promise.resolve(true);
  }

  static async sendValidateMailAddressMail(email, userId) {
    const baseUrl = process.env.NODE_ENV === 'development' ? constants.FRONTEND_LOCAL_URL : constants.FRONTEND_URL;
    return this.sendEmail(email, from_email, constants.MAIL_TEMPLATES_IDS.VALIDATE_EMAIL, { userId, baseUrl });
  }

  static async sendResetPasswordMail(email, resetPasswordToken) {
    const baseUrl = process.env.NODE_ENV === 'development' ? constants.FRONTEND_LOCAL_URL : constants.FRONTEND_URL;
    return this.sendEmail(email, from_email, constants.MAIL_TEMPLATES_IDS.RESET_PASSWORD, { resetPasswordToken, baseUrl });
  }

}

module.exports = EmailController;
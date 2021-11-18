const constants = require("../helpers/constants");
require('dotenv').config();

const from_email = constants.FROM_MAIL_ADDRESS;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const senfGrid = require('sendgrid')(process.env.SENDGRID_API_KEY);
const baseUrl = process.env.NODE_ENV === 'development' ? constants.FRONTEND_LOCAL_URL : constants.FRONTEND_URL;
const userModel = require("../models/user.model");

const {NOTIFICATION_TYPES, MAIL_TEMPLATES_IDS} = constants;

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

  static async sendValidateMailAddressMail(email, userId, language) {
    return this.sendEmail(email, from_email, MAIL_TEMPLATES_IDS.VALIDATE_EMAIL[language], { userId, baseUrl });
  }

  static async sendResetPasswordMail(email, resetPasswordToken, language) {
    return this.sendEmail(email, from_email, MAIL_TEMPLATES_IDS.RESET_PASSWORD[language], { resetPasswordToken, baseUrl });
  }

  static async sendNotificationMail(notification) {
    const toUser = await userModel.findById(notification.user);

    if (!toUser || !toUser.email) {
      return Promise.reject({status: 500, message: "Couldn't find the destination user email notification."});
    }

    const templateId = MAIL_TEMPLATES_IDS.NOTIFICATION[toUser.language || 'fr'];

    if (!templateId) {
      return Promise.reject({status: 500, message: "Couldn't find template id."});
    }

    const notificationType = NOTIFICATION_TYPES[notification.type];

    if (!notificationType) {
      return Promise.reject({status: 500, message: "Couldn't find notificationType."});
    }

    const params = {
      title: notificationType.title,
      text: notificationType.text,
      productTitle: notification.test.product.title,
      baseUrl,
      path: notificationType.to + '?testId=' + notification.test._id
    };

    const emailPromises = [this.sendEmail(toUser.email, from_email, templateId, params)];

    if (notification.type === NOTIFICATION_TYPES.TEST_CANCELLED.value) {
      const adminParams = Object.assign({}, params);
      adminParams.text = "test._id: " + notification.test._id.toString() + ". " + adminParams.text;
      emailPromises.push(this.sendEmail(from_email, from_email, templateId, adminParams));
    }

    return Promise.all(emailPromises);
  }

}

module.exports = EmailController;
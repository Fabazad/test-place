const helper = require('sendgrid').mail;
require('dotenv').config();

const from_email = new helper.Email('test@example.com');
const senfGrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

class EmailController {

  static async sendEmail(body) {
    return new Promise((resolve, reject) => {
      console.log(body.personalizations[0]);
      var request = senfGrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: body,
      });
      
      senfGrid.API(request, function(error, response) {
        console.log(response.statusCode);
        console.log(typeof response.statusCode);
        if (response.statusCode === 202) {
          console.log("test");
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
    mail.setTemplateId("d-d4d5481b37e648b0ad6583ef88d572d6");
    const jsonMail = mail.toJSON();
    jsonMail.personalizations[0].dynamic_template_data = { "resetPasswordToken": resetPasswordToken };
    return this.sendEmail(jsonMail);
  }

}

module.exports = EmailController;
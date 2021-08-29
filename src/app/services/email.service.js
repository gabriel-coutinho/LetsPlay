const nodemailer = require('nodemailer');
const { EMAIL } = require('../../config/environment');
const forgetPasswordTemplate = require('../email/forgetPasswordEmailTemplate');

const transporter = nodemailer.createTransport({
  host: EMAIL.smtp,
  port: EMAIL.port,
  secure: false,
  requireTLS: true,
  service: 'gmail',
  auth: {
    user: EMAIL.email,
    pass: EMAIL.password,
  },
});

const sendForgetPasswordEmail = async (sendTo, forgetPasswordCode) => {
  const html = forgetPasswordTemplate.forgetPassEmail(forgetPasswordCode);

  const mailOptions = {
    from: EMAIL.email,
    to: sendTo,
    subject: 'Código para recuperação de senha',
    html,
  };

  transporter.sendMail(mailOptions);
};

module.exports = {
  sendForgetPasswordEmail,
};

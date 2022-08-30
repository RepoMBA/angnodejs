const nodemailer = require("nodemailer");

exports.sendEmail = (mailContent, email) => {
  let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    auth: {
      user: "info@legitt.xyz",
      pass: "tkhwfcguawbxfryu",
    },
  });

  let mailOptions = {
    from: "info@legitt.xyz",
    to: email,
    subject: "Message from angootha",
    html: mailContent,
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      return false;
    } else {
      return response;
    }
  });
  smtpTransport.close();
};

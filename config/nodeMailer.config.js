const nodeMailer = require('nodemailer');
const serviceEmail = 'osphelpdeskmailer@gmail.com';
const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: serviceEmail,
        pass: 'ScienceMatters'
    }
});
module.exports = {
    'serviceEmail': serviceEmail,
    'transporter': transporter
};

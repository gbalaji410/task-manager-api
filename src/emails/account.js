const sendGridAPIKey = process.env.SENDGRID_API_KEY
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(sendGridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'balaji@simplenhealthy.com',
        subject: 'Thanks for joining us!',
        text: `Welcome ${name} to our Simple and Healthy Food Blog! Hope you enjoy our fresh food ideas!`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'balaji@simplenhealthy.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye ${name}, We hope to see you back soon!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
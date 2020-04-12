const User = require('../models/user')
const auth = require('../middleware/auth')
const boom = require('@hapi/boom')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')

const userPlugin = {
    name: 'userPlugin',
    version: '1.0.0',
    register: async function (server, options) {
        server.route({
            method: 'POST',
            path: '/users',
            handler: async function (req, h) {
                const user = new User(req.payload)
                try {
                    await user.save()
                    sendWelcomeEmail(user.email, user.name)
                    const token = await user.generateAuthToken()
                    return ({user, token})
                }
                catch(e){
                    return boom.badRequest(e)
                }
            }
        })
    }
}

module.exports = userPlugin
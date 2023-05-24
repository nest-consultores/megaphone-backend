const nodemailer = require ( 'nodemailer' )
const {host, pass, port, user} = require ( '../config/email.js')
const fs = require ( 'fs')
const util = require ( 'util')

let transport = nodemailer.createTransport({
  host: host,
  port: port,
  auth: {
    user: user,
    pass: pass
  }
});

export const enviarEmail = async (options) => {
  const optionsEmail = {
    from: 'Meeti <noreply@meeti.com>',
    to: options.usuario.email,
    subject: options.subject,
    html: "<h2>" + options.url + "</h2>"
  }

  const sendEmail = util.promisify(transport.sendMail, transport)
  return sendEmail.call(transport, optionsEmail)
}
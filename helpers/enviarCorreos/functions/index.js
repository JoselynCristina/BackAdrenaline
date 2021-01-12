const functions = require('firebase-functions')
const nodemailer = require('nodemailer')
const express = require('express')
const cors = require('cors')
const emailAth = require('../../../lib/keys').gmailAuth
// const { projectManagement } = require('firebase-admin');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
app.use(cors({ origin: true }))

app.post('/enviarEmail', async (req, res) => {
  const { emailEmpresa, asunto, destino, mensaje } = req.body
  // const { tipoEmail } = req.body
  const isValidMessage = emailEmpresa && asunto && destino && mensaje
  if (!isValidMessage) {
    return res.status(400).send({ message: 'Datos incorrectos' })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'correo_ejm@gmail.com',
      pass: 'contraseña_app_google'
    }
  })

  const mailOptions = {
    from: emailEmpresa,
    to: destino,
    subject: asunto,
    text: mensaje
  }

  await transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return res.status(500).send({ 
        status: false,
        message: 'Ocurrió un problema al enviar el correo.'
      })
    }

    return res.send({ 
      status: true,
      message: 'email enviado'
    })
  })
})

module.exports.mailer = functions.https.onRequest(app)

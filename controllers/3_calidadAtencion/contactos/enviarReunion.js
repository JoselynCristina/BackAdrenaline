'use strict'

const axios = require('axios')
const bcrypt = require('bcrypt')

module.exports = async (db, req, res) => {
  const { idContacto } = req.params
  const { correoClient, linkReunion } = req.body

  const api_email = 'https://us-central1-emailnode-47e4a.cloudfunctions.net/mailer/enviarEmail'
  const body = {
    emailEmpresa: 'grupo7Adrenaline@gmail.com',
    asunto: 'Reunion servicio Adrenalin',
    destino: correoClient,
    mensaje: `Estimado(a) cliente, le agradecemos por contactarnos para brindarle el servicio de Seguimiento de pacientes para su empresa, le enviamos el siguiente link para poder tener una reunión para acordar sobre el servicio. ${linkReunion}
    \nAtentamente, el equipo de Adrenalin.`
  }
  const statusSendEmail = await sendEmail(api_email, body)
  console.log(statusSendEmail)
  if (statusSendEmail) {
    return res.status(200).send({
      status: statusSendEmail,
      mensaje: 'Mensaje enviado correctamente.'
    })
  } else {
    return res.status(400).send({
      status: statusSendEmail,
      mensaje: 'Hubo un problema al enviar el mensaje.'
    })
  }
}

async function sendEmail(route, body) {
  try {
    const response = await axios.post(route, body)
    return response.status
  } catch (error) {
    console.log('error - function .firebase')
    return false
  }
}


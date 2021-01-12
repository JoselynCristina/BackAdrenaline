'use strict'

const axios = require('axios')
const bcrypt = require('bcrypt')

module.exports = async (db, req, res) => {
  const { correoClient, mensaje } = req.body

  // verificar si el correo ya está registrado:
  let processVerificar = true
  let consulta1
  const query = 'CALL verificarMaestro(?)'
  try {
    consulta1 = await db.query(query, [correoClient])
    console.log('--------Verificar.Maestro-----------')
    console.log(consulta1)
    console.log('------------------')
  } catch (error) {
    console.log(error)
    processVerificar = false
  }

  if (consulta1[0].length === 1) {
    return res.status(200).send({
      status: false,
      mensaje: 'Usted ya envió una solicitud de contacto.'
    })
  } else {
    // registrar al contacto(administrador de empresa cliente)
    let processRegistrar = true
    let consulta
    const query = 'CALL guardarContacto(?,?)'
    try {
      consulta = await db.query(query, [correoClient, mensaje])
      console.log('--------Registro.Contacto-----------')
      console.log(consulta)
      console.log('-------------------')
    } catch (error) {
      console.log(error)
      processRegistrar = false
    }
    
    if (consulta.affectedRows === 1 && processRegistrar) {
      // con Contacto registrado, ahora se le envía un correo

      const api_email = 'https://us-central1-emailnode-47e4a.cloudfunctions.net/mailer/enviarEmail'
      const body = {
        emailEmpresa: 'grupo7Adrenaline@gmail.com',
        asunto: 'Información del servicio Adrenalin',
        destino: correoClient,
        mensaje: `Estimado(a) cliente, le agradecemos por contactarnos para brindarle el servicio de 
        Seguimiento de pacientes para su empresa, en breve le estaremos enviando un correo para 
        informarle los detalles para una reunión.`
      }
      const statusSendEmail = await sendEmail(api_email, body)
      console.log(statusSendEmail)
      if (statusSendEmail) {
        return res.status(200).send({
          status: statusSendEmail,
          mensaje: 'Mensaje enviado correctamente.'
        })
      } else {
        return res.status(200).send({
          status: statusSendEmail,
          mensaje: 'Hubo un problema al enviar el mensaje...'
        })
      }
    } else {
      return res.status(200).send({
        status: false,
        mensaje: 'Hubo un problema al enviar el mensaje.'
      })
    }
  }
}

async function sendEmail(route, body) {
  try {
    const response = await axios.post(route, body)
    return response.status
  } catch (error) {
    console.log('error - functino .firebase')
    return false
  }
}


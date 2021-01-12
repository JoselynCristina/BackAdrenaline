'use strict'
const axios = require('axios')

module.exports = async (db, req, res) => {
  const { idEmpresa, idPaciente } = req.params
  const { mensaje, asunto } = req.body
  let emailEmpresa
  try {
    // obtener el correo de la empresa:
    const query1 = 'CALL mostrarEmpresa(?)'
    const datosEmpresa = await db.query(query1, [idEmpresa])
    emailEmpresa = datosEmpresa[0][0].emailEmpresa

    // obtener el correo del paciente
    const query2 = 'CALL detallePacientes(?,?)'
    const datosPaciente = await db.query(query2, [idEmpresa, idPaciente])
    const emailPaciente = datosPaciente[0][0].email

    const api_email = 'https://us-central1-emailnode-47e4a.cloudfunctions.net/mailer/enviarEmail'
    const body = {
      emailEmpresa,
      asunto: asunto,
      destino: emailPaciente,
      mensaje: `Estimado(a) ${datosPaciente[0][0].nombre}. Nosotros, la empresa ${datosEmpresa[0][0].nombreEmpresa} queremos informale lo siguiente en lo que respecta a su tratamiento: \n${mensaje}`
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

  } catch (error) {
    console.log(error)
    return res.status(200).send({
      status: false,
      mensaje: 'Hubo un problema al enviar el mensaje.'
    })
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

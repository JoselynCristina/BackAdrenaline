'use strict'

const axios = require('axios')
const bcrypt = require('bcrypt')

module.exports = async (db, req, res) => {
  const { idContacto } = req.params
  const { correoClient, contraseniaDefault } = req.body

  const encriptContrasenia = await bcrypt.hash(contraseniaDefault, 10)
  // registrar al usuario maestro(administrador de empresa cliente)
  let processRegistrar = true
  let consulta
  const query = 'CALL registrarMaestro(?,?)'
  try {
    consulta = await db.query(query, [correoClient, encriptContrasenia])
    console.log('--------Registro.Maestro-----------')
    console.log(consulta)
    console.log('-------------------')
  } catch (error) {
    console.log(error)
    processRegistrar = false
  }
  
  if (consulta.affectedRows === 1 && processRegistrar) {
    // con Maestro registrado, ahora se le envía un correo
    const api_email = 'ruta/envio/correo'
    const linkPlataforma = 'link/plataforma'
    const body = {
      emailEmpresa: 'correo_ejm@gmail.com',
      asunto: 'Credenciales de acceso Adrenalin',
      destino: correoClient,
      mensaje: `Estimado(a) cliente, le agradecemos la confianza que nos brinda al optar por nuestro servicio, le enviamos sus credenciales de acceso a la plataforma:
      \nPlataforma: ${linkPlataforma}
      \nCorreo: ${correoClient}
      \nContraseña: ${contraseniaDefault}
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
  } else {
    return res.status(500).send({
      status: false,
      mensaje: 'Hubo un problema al registra al usuario de tipo Maestro.'
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


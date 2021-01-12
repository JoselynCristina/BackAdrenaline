'use strict'

const { default: validator } = require('validator')
const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'ingresarLogin'})

module.exports = async function (db, req, res) {
  const { email } = req.body
  
  if (!validator.isEmpty(email)) {
    const query = 'CALL verificarCorreo(?)'
    let processStatus = true
    let verificarCorreo
    try {
      verificarCorreo = await db.query(query, [email])
      log.info('Consulta realizada con éxito')
    } catch (error) {
      processStatus = false
      verificarCorreo[0].length = 0
      log.error(`ERROR: ${error}`);
    }
    if (verificarCorreo[0].length > 0 && processStatus) {
      log.info('Lista de contactos cargada correctamente')
      res.send({
        status: true,
        statusCode: 200,
        message: 'Correo en plataforma.',
        existe: verificarCorreo[0][0].existe
      })
    } else {
      res.send({
        status: false,
        statusCode: 500,
        message: 'Hubo un problema al verificar el correo.'
      })
    }
  } else {
    res.send({
      status: false,
      statusCode: 400,
      message: 'Datos incorrectos.'
    })
  }
}

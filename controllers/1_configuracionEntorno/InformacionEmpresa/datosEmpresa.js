'use strict'
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'datosEmpresa' });

async function mostrarEmpresa (idEmpresa, db) {
  const query = 'CALL mostrarEmpresa(?)'
  let processStatus = true
  let process
  try {
    process = await db.query(query, [idEmpresa])
    log.info('Consulta bd-mostrarEmpresa correcta')
  } catch (error) {
    processStatus = false
    log.warn(`ERROR: ${error}`)
  }
  // console.log(process[0].length)
  if (process[0].length === 1 && processStatus) {
    return {
      status: true,
      statusCode: 200,
      message: 'Se encontró a la empresa.',
      empresa: process[0][0]
    }
  } else {
    return {
      status: false,
      statusCode: 400,
      message: 'No se encontro a la empresa.'
    }
  }
}

module.exports = async function (db, req, res) {
  const { idEmpresa } = req.params
  let processStatus = true
  let data
  try {
    data = await mostrarEmpresa(idEmpresa, db)
    log.info('funcion mostrarEmpresa correcta')
  } catch (error) {
    log.warn(`ERROR: ${error}`)
    processStatus = false
  }
  if (data.status && processStatus) {
    log.info('Proceso correcto, enviando datos')
    res.send({
      empresa: data.empresa,
      message: data.message,
      status: data.status,
      statusCode: data.statusCode
    })
  } else {
    log.warn('Proceso con error, enviando datos.')
    res.send({
      message: data.message,
      status: data.status,
      statusCode: data.statusCode
    })
  }
}

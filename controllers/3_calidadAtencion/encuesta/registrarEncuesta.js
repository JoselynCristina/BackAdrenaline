'use strict'

const { default: validator } = require("validator")
const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'registrarEncuesta'})

async function registrarEncuesta(db, puntajePregunta1, puntajePregunta2, puntajePregunta3, puntajePregunta4, puntajePregunta5, observacion, idPaciente, idEmpresa){

  const query = 'CALL registrarEncuesta(?,?,?,?,?,?,?,?)'
  let processStatus = true
  let process
  try {
    process = await db.query(query, [puntajePregunta1, puntajePregunta2, puntajePregunta3, puntajePregunta4, puntajePregunta5, observacion, idEmpresa, idPaciente])
    log.info('Consulta para registrar una encuesta realizada con éxito')
  } catch (error) {
    console.log(error)
    processStatus = false
  }
  log.info(process)
  if (processStatus) {
    log.info('encuesta guardada correctamente')
    return {
      statusCode: 200,
      status: true,
      message: 'Datos enviados correctamente.'
    }
  } else {
    return {
      statusCode: 500,
      status: false,
      message: 'Hubo un problema al registra la data de la encuesta.'
    }
  }
}

module.exports = async function (db, req, res) {
  const { idPaciente, idEmpresa } = req.params
  const {puntajePregunta1, puntajePregunta2, puntajePregunta3, puntajePregunta4, puntajePregunta5, observacion } = req.body
  if (validateData(puntajePregunta1, puntajePregunta2, puntajePregunta3, puntajePregunta4, puntajePregunta5, observacion, idPaciente, idEmpresa)) {
    let processStatus
    let process
    try {
      process = await registrarEncuesta(db, puntajePregunta1, puntajePregunta2, puntajePregunta3, puntajePregunta4, puntajePregunta5, observacion, idPaciente, idEmpresa, db)
      log.info('proceso de registrarEncuesta sin errores')
    } catch (error) {
      log.warn(`proceso de registrarEncuesta con errores ${error}`)
      processStatus = false
      process = {
        status: false,
        message: 'No se pudo registrar la Encuesta',
        statusCode: 500
      }
    }
    res.send({
      message: process.message,
      status: process.status,
      statusCode: process.statusCode
    })
  } else {
    res.send({
      status: false,
      message: 'Formato de valores incorrecto, intente nuevamente.',
      statusCode: 400
    })
  }
}

function validateData(puntajePregunta1, puntajePregunta2, puntajePregunta3, puntajePregunta4, puntajePregunta5, observacion, idPaciente, idEmpresa) {
  const validatePuntajePregunta1 = !validator.isEmpty(puntajePregunta1) && validator.isNumeric(puntajePregunta1)
  const validatePuntajePregunta2 = !validator.isEmpty(puntajePregunta2) && validator.isNumeric(puntajePregunta2)
  const validatePuntajePregunta3 = !validator.isEmpty(puntajePregunta3) && validator.isNumeric(puntajePregunta3)
  const validatePuntajePregunta4 = !validator.isEmpty(puntajePregunta4) && validator.isNumeric(puntajePregunta4)
  const validatePuntajePregunta5 = !validator.isEmpty(puntajePregunta5) && validator.isNumeric(puntajePregunta5)
  const validateObservacion = !validator.isEmpty(observacion) || observacion === ''
  const validateIdPaciente = !validator.isEmpty(idPaciente) && validator.isNumeric(idPaciente)
  const validateIdEmpresa = !validator.isEmpty(idEmpresa) && validator.isNumeric(idEmpresa)

  return validatePuntajePregunta1 && validatePuntajePregunta2 && validatePuntajePregunta3 && validatePuntajePregunta4 && validatePuntajePregunta5 && validateObservacion && validateIdPaciente && validateIdEmpresa
}

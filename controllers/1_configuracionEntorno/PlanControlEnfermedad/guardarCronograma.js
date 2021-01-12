'use strict'
const { default: validator } = require('validator')
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: 'guardarCronograma' });

async function guardarCronograma (nombrePlan, intervaloConsulta, duracionPlan, descripcion, db) {
  const query = 'CALL guardarPlan(?,?,?,?)'
  let processStatus = true
  let process
  try {
    process = await db.query(query, [nombrePlan, descripcion, duracionPlan, intervaloConsulta])
    log.info('Consulta para guardar cronograma correcta')
  } catch (error) {
    log.warn(`ERROR: ${error}`)
    processStatus = false
  }
  log.info(process)
  if (processStatus) {
    log.info('cronograma guardado correctamente')
    return {
      status: true,
      statusCode: 200,
      message: 'Plan guardado con éxito'
    }
  } else {
    log.warn('cronograma no guardado')
    return {
      status: false,
      statusCode: 500,
      message: 'No se pudo guardar el plan, intente nuevamente.'
    }
  }
}

module.exports = async function (db, req, res) {
  const { nombrePlan, intervaloConsulta, duracionPlan, descripcion } = req.body
  if (validateDatos(nombrePlan, intervaloConsulta, duracionPlan, descripcion)) {
    let process
    try {
      process = await guardarCronograma(nombrePlan, intervaloConsulta, duracionPlan, descripcion, db)
      log.info('proceso de guardarCronograma sin errores')
    } catch (error) {
      log.warn(`proceso de guardarCronograma con errores ${error}`)
      processStatus = false
      process = {
        status: false,
        message: 'No se pudo guardar el cronograma',
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
      message: 'Formato de valores incorrecto, intente nuevamente.'
    })
  }
}

function validateDatos (nombrePlan, intervaloConsulta, duracionPlan, descripcion) {
  const validateNombrePlan = !validator.isEmpty(nombrePlan)
  const validatePeriodoConsulta = !validator.isEmpty(intervaloConsulta) && validator.isNumeric(intervaloConsulta)
  const validateDuracionPlan = !validator.isEmpty(duracionPlan) && validator.isNumeric(duracionPlan)
  const validateDescripcion = !validator.isEmpty(descripcion)

  return validateNombrePlan && validatePeriodoConsulta && validateDuracionPlan && validateDescripcion
}

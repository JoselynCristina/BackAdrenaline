'use strict'
const { default: validator } = require('validator')
const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'guardarDataConsulta'});

async function guardarDataConsulta (comentarios, recomendaciones, estado, idEmpleado, idPaciente, db) {
  const query = 'CALL registrarConsulta(?,?,?,?,?)' //crear SP que jale nombre del doctor
  let processStatus = true
  let process
  try {
    process = await db.query(query, [comentarios, recomendaciones, estado, idPaciente, idEmpleado])
    log.info('Consulta realizada con éxito')
  } catch (error) {
    processStatus = false
    log.error(`ERROR: ${error}`);
  }

  if (process[0][0].idConsulta > 0 && processStatus) {
    log.info('Información de la Consulta guardada correctamente')
    return {
      status: true,
      statusCode: 200,
      message: 'Información de la Consulta guardada correctamente',
      idConsulta: process[0][0].idConsulta
    }
  } else {
    log.warn({ lang: 'es' }, 'No se pudo guardar la data de la consulta, intente nuevamente')
    return {
      status: false,
      statusCode: 400,
      message: 'No se pudo guardar la data de la consulta, intente nuevamente.'
    }
  }
}

module.exports = async function (db, req, res) {
  const { idEmpleado, idPaciente } = req.params
  const { comentarios, recomendaciones, estado } = req.body
  if (validateDatos(comentarios, recomendaciones, estado, idEmpleado, idPaciente)) {
    let process
    let processStatus = true
    try {
      process = await guardarDataConsulta(comentarios, recomendaciones, estado, idEmpleado, idPaciente, db)
      log.info('Consulta realizada con éxito')
    } catch (error) {
      processStatus = false
      log.error(`ERROR: ${error}`);
    }

    if (process && processStatus) {
      log.info('Consulta guardada correctamente')
      res.send({
        message: process.message,
        status: process.status,
        statusCode: process.statusCode,
        idConsulta: process.idConsulta
      })
    } else {
      log.warn({ lang: 'es' }, 'Ocurrió un error al guardar su consulta')
      res.send({
        message: process.message,
        status: process.status,
        statusCode: process.statusCode
      })
    }
  } else {
    log.warn({ lang: 'es' }, 'Formato de valores incorrecto, intente nuevamente')
    res.send({
      message: 'Formato de valores incorrecto, intente nuevamente.',
      status: false
    })
  }
}

function validateDatos (comentarios, recomendaciones, estado, idEmpleado, idPaciente) {
  const validateComentarios = !validator.isEmpty(comentarios)
  const validateRecomendaciones = !validator.isEmpty(recomendaciones)
  const validateEstado = !validator.isEmpty(estado)
  const validateIdEmpleado = !validator.isEmpty(idEmpleado) && validator.isNumeric(idEmpleado)
  const validateIdPaciente = !validator.isEmpty(idPaciente) && validator.isNumeric(idPaciente)
  return validateComentarios && validateRecomendaciones && validateEstado && validateIdEmpleado && validateIdPaciente
}
'use strict'
const bunyan = require('bunyan');
const { default: validator } = require('validator');
const log = bunyan.createLogger({ name: 'editarCronograma' });

async function editarCronogramas (idPlan, nombrePlan, descripcion, duracionPlan, intervaloConsulta, db) {
  const query = 'CALL editarCronograma(?, ?, ?, ?, ?)'
  let processStatus = true
  let process
  try {
    process = await db.query(query, [idPlan, nombrePlan, descripcion, duracionPlan, intervaloConsulta])
    log.info('Editar-cronograma correcto')
  } catch (error) {
    log.warn(`Editar-cronograma ERROR: ${error}`)
    processStatus = false
  }
  console.log(process)
  if (process.affectedRows === 1 && processStatus) {
    return {
      status: true,
      message: 'Se pudo editar el cronograma seleccionado.'
      //idPlan: process[0][0].idPlan
    }
  } else {
    return {
      status: false,
      message: 'Hubo un error al querer editar el cronograma seleccionado, intente nuevamente.'
    }
  }
}

module.exports = async function (db, req, res) {
  const {idPlan} = req.params
  const {nombrePlan, descripcion, duracionPlan, intervaloConsulta} = req.body
  if(validateDatos(idPlan, nombrePlan, descripcion, duracionPlan, intervaloConsulta)){
    let process
    try {
      process = await editarCronogramas(idPlan, nombrePlan, descripcion, duracionPlan, intervaloConsulta, db)
      log.info('proceso de editarCronograma sin errores')
    } catch (error) {
      log.warn(`proceso de editarCronograma con errores ${error}`)
      processStatus = false
      process = {
        status: false,
        message: 'No se pudo editar el cronograma',
        statusCode: 500
      }
    }
    res.send({
      message: process.message,
      status: process.status,
      statusCode: process.statusCode
    })
  }else {
    res.send({
      status: false,
      message: 'Formato de valores incorrecto, intente nuevamente.'
    })
  }
  
}


function validateDatos (idPlan, nombrePlan, descripcion, duracionPlan, intervaloConsulta) {
  const validateIdPlan = !validator.isEmpty(idPlan) // && validator.isNumeric(idPlan)
  const validateNombrePlan = !validator.isEmpty(nombrePlan)
  const validatePeriodoConsulta = !validator.isEmpty(intervaloConsulta)// && validator.isNumeric(intervaloConsulta)
  const validateDuracionPlan = !validator.isEmpty(duracionPlan)// && validator.isNumeric(duracionPlan)
  const validateDescripcion = !validator.isEmpty(descripcion)

  return validateIdPlan && validateNombrePlan && validatePeriodoConsulta && validateDuracionPlan && validateDescripcion
}
'use strict'
const { default: validator } = require('validator')
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'detallePersonalEmpresa' });

module.exports = async function (db, req, res) {
  const { idEmpresa, idPersonal } = req.params

  if (validateData(idEmpresa, idPersonal)) {
    const query = 'CALL detallePersonal(?,?)'
    let processStatus = true
    let consulta
    try {
      consulta = await db.query(query, [idEmpresa, idPersonal])
      log.info('Consulta realizada con éxito')
    } catch (error) {
      processStatus = false
      log.error(`ERROR: ${error}`);
    }
    if (consulta[0].length > 0 && processStatus) {
      log.info('Personal encontrado')
      res.send({
        status: true,
        statusCode: 200,
        personal: consulta[0][0],
        message: 'Personal encontrado.'
      })
    } else {
      log.warn({ lang: 'es' }, 'Personal no encontrado')
      res.send({
        status: false,
        statusCode: 404,
        message: 'Personal no encontrado.'
      })
    }
  } else {
    log.warn({ lang: 'es' }, 'Datos incorrectos')
    res.send({
      status: false,
      statusCode: 400,
      message: 'Datos incorrectos'
    })
  }
}

function validateData (idEmpresa, idPersonal) {
  const validateIdEmpresa = !validator.isEmpty(idEmpresa)
  const validateIdPersonal = !validator.isEmpty(idPersonal)
  return validateIdEmpresa && validateIdPersonal
}

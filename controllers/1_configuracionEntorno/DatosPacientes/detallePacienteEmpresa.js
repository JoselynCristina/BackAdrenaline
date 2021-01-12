'use strict'
const { default: validator } = require('validator')
const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'detallePacienteEmpresa'});

module.exports = async function (db, req, res) {
  const { idEmpresa, idPaciente } = req.params

  if (validateData(idEmpresa, idPaciente)) {
    const query = 'CALL detallePacientes(?,?)'
    let processStatus = true
    let consulta
    try {
      consulta = await db.query(query, [idEmpresa, idPaciente])
      log.info('Consulta ejecutada correctamente')
    } catch (error) {
      log.error(`ERROR: ${error}`)
      processStatus = false
      consulta[0][0].dni = 0
    }
    if (consulta[0].length > 0 && processStatus) {
      log.info('Paciente encontrado')
      res.send({
        status: true,
        statusCode: 200,
        paciente: consulta[0][0],
        message: 'Paciente encontrado.'
      })
      
    } else {
      log.warn({ lang: 'es' }, `Paciente id-${idPaciente} no encontrado`);
      res.send({
        status: false,
        statusCode: 404,
        message: 'Paciente no encontrado.'
      })
      
    }
  } else {
    log.warn({ lang: 'es' }, 'Datos incorrectos');
    res.send({
      status: false,
      statusCode: 400,
      message: 'Datos incorrectos'
    })
  }
}

function validateData (idEmpresa, idPaciente) {
  const validateIdEmpresa = !validator.isEmpty(idEmpresa)
  const validateIdPaciente = !validator.isEmpty(idPaciente)
  return validateIdEmpresa && validateIdPaciente
}

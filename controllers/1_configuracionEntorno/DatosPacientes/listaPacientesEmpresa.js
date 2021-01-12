'use strict'
const { default: validator } = require('validator')
const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'listaPacientesEmpresa'});

module.exports = async function (db, req, res) {
  const { idEmpresa } = req.params

  if (!validator.isEmpty(idEmpresa)) {
    const query = 'CALL listarPacientes(?)'
    let processStatus = true
    let listaPacientes
    try {
      listaPacientes = await db.query(query, [idEmpresa])
      log.info('Consulta realizada con éxito')
    } catch (error) {
      processStatus = false
      listaPacientes[0].length = 0
      log.error(`ERROR: ${error}`);
    }
    if (listaPacientes[0].length > 0 && processStatus) {
      log.info('Lista de pacientes cargada correctamente')
      res.send({
        status: true,
        statusCode: 200,
        message: 'Lista de pacientes cargada correctamente.',
        listaPacientes: listaPacientes[0]
      })
    } else if (listaPacientes[0].length === 0 && processStatus) {
      log.warn({lang: 'es'}, 'No hay pacientes registrados aún')
      res.send({
        status: false,
        statusCode: 404,
        message: 'No hay pacientes registrados aún.'
      })
    }
  } else {
    log.warn({lang: 'es'}, 'Datos incorrectos')
    res.send({
      status: false,
      statusCode: 400,
      message: 'Datos incorrectos'
    })
  }
}

'use strict'
const { default: validator } = require('validator')
const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'listaPersonalEmpresa'});

module.exports = async function (db, req, res) {
  const { idEmpresa } = req.params

  if (!validator.isEmpty(idEmpresa)) {
    const query = 'CALL listarPersonal(?)'
    let processStatus = true
    let listaPersonal
    try {
      listaPersonal = await db.query(query, [idEmpresa])
      log.info('Consulta realizada con éxito')
    } catch (error) {
      processStatus = false
      log.error(`ERROR: ${error}`);
    }
    if (listaPersonal[0].length > 0 && processStatus) {
      log.info('Lista cargada correctamente')
      res.send({
        status: true,
        statusCode: 200,
        message: 'Lista cargada correctamente.',
        listaPersonal: listaPersonal[0]
      })
    } else if (listaPersonal[0].length === 0 && processStatus) {
      log.warn({lang: 'es'}, 'No hay personal registrados aún')
      res.send({
        status: false,
        statusCode: 404,
        message: 'No hay personal registrados aún.'
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

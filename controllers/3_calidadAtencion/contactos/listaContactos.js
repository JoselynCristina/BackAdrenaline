'use strict'
const { default: validator } = require('validator')
const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'listaContactos'});

module.exports = async function (db, req, res) {

  const query = 'CALL listarContacto()'
  let processStatus = true
  let listaContactos
  try {
    listaContactos = await db.query(query, [])
    log.info('Consulta realizada con éxito')
  } catch (error) {
    processStatus = false
    listaContactos[0].length = 0
    log.error(`ERROR: ${error}`);
  }
  if (listaContactos[0].length > 0 && processStatus) {
    log.info('Lista de contactos cargada correctamente')
    res.send({
      status: true,
      statusCode: 200,
      message: 'Lista de contactos cargada correctamente.',
      listaContactos: listaContactos[0]
    })
  } else if (listaContactos[0].length === 0 && processStatus) {
    log.warn({lang: 'es'}, 'No hay contactos registrados aún')
    res.send({
      status: false,
      statusCode: 404,
      message: 'No hay contactos registrados aún.'
    })
  }
}

'use strict'
const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'mostrarDataConsulta'});

async function mostrarConsulta (idConsulta, db) {
  const query = 'CALL mostrarConsulta(?)'
  let processStatus = true
  let process
  try {
    process = await db.query(query, [idConsulta])
    console.log('******************************')
    console.log(process)
    console.log('******************************')
    log.info('mostrarConsulta sin-error')
  } catch (error) {
    processStatus = false
    log.error(`ERROR: ${error}`);
  } 
  // console.log(process[0].length)
  if (process[0].length === 1 && processStatus) {
    log.info('Se encontró la data de la consulta')
    return {
      status: true,
      statusCode: 200,
      message: 'Se encontró la data de la consulta.',
      consulta: process[0][0]
    }
  } else {
    log.warn({ lang: 'es' }, 'No se encontró la data de la consulta')
    return {
      status: false,
      statusCode: 400,
      message: 'No se encontro la data de la consulta.'
    }
  }
}

module.exports = async function (db, req, res) {
  const { idConsulta } = req.params
  let xd
  let processStatus = true
  try {
    xd = await mostrarConsulta(idConsulta, db)
    log.info('Consulta realizada con éxito')
  } catch (error) {
    log.error(`ERROR: ${error}`);
  }
  if (xd.status && processStatus) {
    log.info('Se pudo mostrar la data de la consulta')
    res.send({
      consulta: xd.consulta,
      message: xd.message,
      status: xd.status,
      statusCode: xd.statusCode
    })
  } else {
    log.info('No se pudo mostrar la data de la consulta')
    res.send({
      message: xd.message,
      status: xd.status,
      statusCode: xd.statusCode
    })
  }
}
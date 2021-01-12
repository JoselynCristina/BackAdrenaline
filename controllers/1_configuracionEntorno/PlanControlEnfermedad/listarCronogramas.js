'use strict'
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: 'listarCronogramas' });

async function obtenerCronogramas (db) {
  const query = 'CALL mostrarCronogramasDisponibles()'
  let processStatus = true
  let process
  try {
    process = await db.query(query, [])
    log.info('Consulta-cronogramas correcta')
  } catch (error) {
    log.warn(`Consulta-cronogramas ERROR: ${error}`)
    processStatus = false
  }
  console.log(process)
  if (process.length > 0 && processStatus) {
    return {
      status: true,
      message: 'Se pudo retornar la lista de cronogramas.',
      cronogramas: process[0]
    }
  } else {
    return {
      status: false,
      message: 'Hubo un error al obtener la lista de cronogramas, intente nuevamente.'
    }
  }
}

module.exports = async function (db, req, res) {
  let processStatus = true
  let process
  try {
    process = await obtenerCronogramas(db)
    log.info('lista-cronogramas obtenidos')
  } catch (error) {
    log.warn(`ERROR: ${error}`)
    processStatus = false
  }
  if (process.status && processStatus) {
    log.info('Enviando datos correctos')
    res.send({
      cronogramas: process.cronogramas,
      message: process.message,
      status: process.status
    })
  } else {
    log.warn('Enviando datos de error')
    res.send({
      message: process.message,
      status: process.status
    })
  }
}

'use strict'

const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'cantidaPacientesPlan' });

module.exports = async (db, req, res) => {
  const { idPlan } = req.params
  let processStatus = true
  let process
  try {
    const query = 'CALL cantidadPacientes(?)' // debe entregar idPlan y cantidadPacientes
    process = await db.query(query, [idPlan])
    log.info('consulta de cantidadPacientesPlan sin-error')
  } catch (error) {
    processStatus = false
    log.warn(`Error: ${error}`)
  }

  if (process[0][0].idPlan === undefined) {
    log.info(`Plan ${idPlan} no encontrado`)
    res.send({
      status: false,
      statusCode: 404,
      message: 'Plan no encontrado encontrado'
    })
  } else if (processStatus && process[0][0].idPlan) {
    res.send({
      status: true,
      statusCode: 200,
      cantidadPacientes: process[0][0].cantidadPacientes
    })
  } else {
    res.send({
      status: false,
      statusCode: 500,
      message: 'Ocurrió un problema al cargar datos del plan.'
    })
  }
}
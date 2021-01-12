'use strict'

const { default: validator } = require('validator')
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'disponibilidadConsultaPaciente' });
module.exports = async (db, req, res) => {
  const { dni, cantidadCitasPaciente } = req.params
  if (validateData(dni)) {
    const query = 'CALL buscarPaciente(?)' // debe entregar datos como persona y como paciente
    let processStatus = true
    let process
    try {
      process = await db.query(query, [dni])
      log.info('buscar paciente por dni-sin error')
    } catch (error) {
      processStatus = false
      log.warn(`Error: ${error}`)
    }
    if (process[0][0].idPaciente === undefined) {
      log.warn(`Paciente de dni ${dni} no encontrado`)
      res.send({
        status: false,
        statusCode: 404,
        message: 'Paciente no encontrado encontrado'
      })
    } else if (processStatus && process[0][0].idPaciente) {
      log.info(`Paciente con dni ${dni} encontrado`)
      // entregar datos: nombres, apellidoPaterno, apellidoMaterno, celular, correoElectronico, grupoSanguineo
      // entregar datos: cantidad de consultas que tiene, cantidad de consultas del plan
      /**
       * comparar,
       * si la cantidad de consultas que tiene supera a la cantidad de consultas del plan, 
       * informar que el paciente ya completo su tratamiento
       * caso contrario, enviar objeto Paciente y Persona, message: 'consulta permitida' 
       */
      let processCantidadConsultas = true
      let cantidadConsultas
      try {
        const query = 'CALL cantidadConsultas(?)' // ? = idPacientes
        cantidadConsultas = await db.query(query, [process[0][0].idPaciente])
        log.info('consultar consultas de paciente sin-error')
      } catch (error) {
        processCantidadConsultas = false
        log.warn(`Error: ${error}`)
      }



      if (processCantidadConsultas && cantidadConsultas[0][0].duracionPlan) {
        const cantidadConsultasPaciente = cantidadConsultas[0][0].numeroConsulta
        const cantidadConsultasPlan = cantidadConsultas[0][0].duracionPlan
        if (cantidadConsultasPaciente < cantidadConsultasPlan) {
          // informar que se puede realizar la consulta y enviar datos del paciente
          log.info(`Se le puede agregar consulta al paciente ${dni}`)
          res.send({
            status: true,
            statusCode: 200,
            message: 'Se le puede agregar consultas al paciente.',
            paciente: process[0][0]
          })
        } else {
          log.info(`No se le puede agregar consulta al paciente ${dni}`)
          res.send({
            status: false,
            statusCode: 400,
            message: 'No se le puede agregar consultas al paciente porque ya terminó su tratamiento.'
          })
        }
      } else {
        log.error(`No se obtuvo la cantidad de consultas del paciente ${dni}`)
        res.send({
          status: false,
          statusCode: 500,
          message: 'No se pudo obtener la cantidad de consultas del paciente.'
        })
      }
    } else {
      log.error('Error al buscar paciente por dni')
      res.send({
        status: false,
        statusCode: 500,
        message: 'Ocurrió un problema al buscar al paciente.'
      })
    }
  } else {
    res.send({
      status: false,
      statusCode: 400,
      message: 'Datos incompletos.'
    })
  }

}

function validateData (dni) {
  return !validator.isEmpty(dni)
}

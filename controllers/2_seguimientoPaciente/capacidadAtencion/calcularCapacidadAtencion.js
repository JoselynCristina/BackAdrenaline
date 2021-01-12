'use strict'

const bunyan = require('bunyan')
const moment = require('moment')
const log = bunyan.createLogger({ name: 'calcularCapacidadAtencion' });

module.exports = async (db, req, res) => {
  const { idEmpresa, idPlan } = req.params
  
  // solicitar datos para calculo
  const query = 'CALL datosCalculoIteracion(?,?)'
  let processStatus = true
  let process
  try {
    process = await db.query(query, [idEmpresa, idPlan])
    log.info('Datos para calculoIteracion obtenidos')
  } catch (error) {
    processStatus = false
    log.warn(`ERROR: ${error}`)
  }

  if (processStatus) {
    let intervaloDias = process[0][0].duracionPlan
    let cantidadConsultas = process[0][0].intervaloConsulta // x dia
    let cantidadMedicos = process[0][0].cantidadEmpleados
    let cantidadPacientes = process[0][0].cantidadPacientes
    let atencionDiaria = process[0][0].citasAlDia
  
    // proceso:
  
    //calcular tamaño de arreglo de atenciones:
    let tamArray = cantidadPacientes / (cantidadMedicos * atencionDiaria)
    let moduloTam = cantidadPacientes%(cantidadMedicos*atencionDiaria)
    let arrayAtenciones = []
    let tamArrayAtenciones
    if ( moduloTam > 0) {
      console.log('irregular')
      console.log({
        tamArray,
        moduloTam
      })
      arrayAtenciones = []
      tamArrayAtenciones = Math.floor(tamArray) + 1
      console.log(tamArrayAtenciones)
    } else {
      console.log('normal')
      tamArrayAtenciones = Math.floor(tamArray)
    }
  
    // llenar arrayAtenciones
    var arrayDiasAtencion
    let tamArrayDiasAtencion
    console.log({intervaloDias, cantidadConsultas, cantidadMedicos, cantidadPacientes, atencionDiaria})
    
    for (let i = 0; i < tamArrayAtenciones; i++) {
      arrayDiasAtencion = []
      let diaInicio = i+1
      let diaToca = 0
      for (let j = 0; j < cantidadConsultas; j++) {
        diaToca = diaInicio + j*intervaloDias 
        // console.log('push--->>>>>> ', diaToca)
        arrayDiasAtencion.push(diaToca)
      }
      arrayAtenciones[i] = arrayDiasAtencion
    }
  
    // mostrar
    for (let data1 = 0; data1 < tamArrayAtenciones; data1++) {
      for (let data2 = 0; data2 < arrayDiasAtencion.length; data2++) {
        console.log(`[Data-${data1}]--->>> {${arrayAtenciones[data1][data2]}}`)
      }
    }
  
    const ultimoDiaAtencion = arrayAtenciones[tamArrayAtenciones-1][arrayDiasAtencion.length-1]
    const fechaFinalizacion = moment().add(ultimoDiaAtencion, 'days').utc().format("D-MM-YYYY")
    res.send({
      status: true,
      statusCode: 200,
      message: `La iteración termina el dia ${ultimoDiaAtencion} (${fechaFinalizacion})`
    })

  } else {
    res.send({
      status: false,
      statusCode: 500,
      message: 'No se pudo realizar el cálculo de la iteración, intente nuevamente.'
    })
  }
}

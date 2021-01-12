'use strict'
const { default: validator } = require('validator')

module.exports = async (db, req, res) => {
  const { idEmpresa } = req.params

  if (validateData(idEmpresa)) {
    const query = 'CALL datosEncuesta(?)'
    let processStatus = true
    let process
    let parseData = []

    let pregunta1 = {
      puntaje1: 0,
      puntaje2: 0,
      puntaje3: 0,
      puntaje4: 0,
      puntaje5: 0,
    }
    let pregunta2 = {
      puntaje1: 0,
      puntaje2: 0,
      puntaje3: 0,
      puntaje4: 0,
      puntaje5: 0,
    }
    let pregunta3 = {
      puntaje1: 0,
      puntaje2: 0,
      puntaje3: 0,
      puntaje4: 0,
      puntaje5: 0,
    }
    let pregunta4 = {
      puntaje1: 0,
      puntaje2: 0,
      puntaje3: 0,
      puntaje4: 0,
      puntaje5: 0,
    }
    let pregunta5 = {
      puntaje1: 0,
      puntaje2: 0,
      puntaje3: 0,
      puntaje4: 0,
      puntaje5: 0,
    }
    let observaciones = []
    try {
      process = await db.query(query, [idEmpresa])
      await process[0].filter(data => {
        switch (data.puntajePregunta1) {
          case 1:
            pregunta1.puntaje1 ++
            break
          case 2:
            pregunta1.puntaje2 ++
            break
          case 3:
            pregunta1.puntaje3 ++
            break
          case 4:
            pregunta1.puntaje4 ++
            break
          case 5:
            pregunta1.puntaje5 ++
            break
        }
        switch (data.puntajePregunta2) {
          case 1:
            pregunta2.puntaje1 ++
            break
          case 2:
            pregunta2.puntaje2 ++
            break
          case 3:
            pregunta2.puntaje3 ++
            break
          case 4:
            pregunta2.puntaje4 ++
            break
          case 5:
            pregunta2.puntaje5 ++
            break
        }
        switch (data.puntajePregunta3) {
          case 1:
            pregunta3.puntaje1 ++
            break
          case 2:
            pregunta3.puntaje2 ++
            break
          case 3:
            pregunta3.puntaje3 ++
            break
          case 4:
            pregunta3.puntaje4 ++
            break
          case 5:
            pregunta3.puntaje5 ++
            break
        }
        switch (data.puntajePregunta4) {
          case 1:
            pregunta4.puntaje1 ++
            break
          case 2:
            pregunta4.puntaje2 ++
            break
          case 3:
            pregunta4.puntaje3 ++
            break
          case 4:
            pregunta4.puntaje4 ++
            break
          case 5:
            pregunta4.puntaje5 ++
            break
        }
        switch (data.puntajePregunta5) {
          case 1:
            pregunta5.puntaje1 ++
            break
          case 2:
            pregunta5.puntaje2 ++
            break
          case 3:
            pregunta5.puntaje3 ++
            break
          case 4:
            pregunta5.puntaje4 ++
            break
          case 5:
            pregunta5.puntaje5 ++
            break
        }
        observaciones.push(data.observacion)
        /*parseData.push({
          
          /*
          idFormulario: data.idFormulario,
          idPaciente: data.Paciente_idPaciente,
          idEmpresa: data.Empresa_idEmpresa,
          puntaje1: data.puntajePregunta1,
          puntaje2: data.puntajePregunta2,
          puntaje3: data.puntajePregunta3,
          puntaje4: data.puntajePregunta4,
          puntaje5: data.puntajePregunta5,
          observacion: data.observacion // que en la BD se guarde como default con un string vacio
        })*/
      })
    } catch (error) {
      console.log(error)
      processStatus = false
    }

    if (processStatus && process[0][0].Empresa_idEmpresa) {
      res.send({
        statusCode: 200,
        status: true,
        message: 'Datos de encuesta cargados correctamente.',
        datos: [
          pregunta1,
          pregunta2,
          pregunta3,
          pregunta4,
          pregunta5
        ],
        observaciones
        /**
         * @tipoDatos
         * [{
              idDato,
              idPaciente,
              idEmpleado,
              puntajes: [
                puntaje1,
                puntaje2,
                puntaje3,
                puntaje4,
                puntaje5
              ],
              observacion
         * }]
         */
      })
    } else {
      res.send({
        statusCode: 500,
        status: false,
        message: 'Hubo un problema al cargar los datos de la encuesta.'
      })
    }
  } else {
    res.send({
      statusCode: 400,
      status: false,
      message: 'Datos incorrectos'
    })
  }
}

function validateData(data) {
  return !validator.isEmpty(data)
}

'use strict'
const { default: validator } = require('validator')
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'editarPaciente' });
/*
  El sistema debe mostrar una opción para guardar los datos del paciente en el sistema
  El sistema debe validar que los campos ingresados tengan el formato correcto
  El sistema debe mostrar una notificación cuando los datos se hayan guardado correctamente
  El sistema debe mostrar los datos actualizados del paciente
*/
//
module.exports = async function (db, req, res) {
  const { idPaciente } = req.params
  const { nombre, apellidoPat, apellidoMat, celular, genero, dni, nacimiento, direccion, estadoCivil, ocupacion, email, grupoSanguineo } = req.body
  const newPaciente = {
    nombre,
    apellidoPat,
    apellidoMat,
    dni,
    nacimiento,
    celular,
    direccion,
    ocupacion,
    email,
    genero, // M - F
    grupoSanguineo,
    estadoCivil,
    idPaciente
  }

  if (validateData(newPaciente)) {
    // verificar si el paciente ya está registrado (dni, idEmpresa)
    
      // consulta de tipo:  update into pacientes where (?)
      const query2 = 'CALL editarPaciente(?,?,?,?,?,?,?,?,?,?,?,?,?)' //13
      const process = await db.query(query2, [nombre, apellidoPat, apellidoMat, dni, nacimiento, celular, direccion, ocupacion, email, genero, grupoSanguineo, estadoCivil, parseInt(idPaciente)]) //13
      if (process.affectedRows > 0) {
        process.status = true
        process.statusCode = 200
        process.message = 'Paciente registrado correctamente.'
        log.info('Paciente editado correctamente')
      } else {
        process.status = false
        process.statusCode = 400
        process.message = 'No se pudo editar al paciente.'
        log.info('No se pudo editar al paciente')
      }
      res.send({
        status: process.status,
        statusCode: process.statusCode,
        message: process.message
      })
    
  } else {
    log.warn({ lang: 'es' }, 'Datos incorrectos, intente nuevamente')
    res.send({
      status: false,
      statusCode: 400,
      message: 'Datos incorrectos, intente nuevamente'
    })
  }
}

function validateData (paciente) {
  let validado = true
  const validando = []
  console.log(paciente)
  const nombreValidate = paciente.nombre.replace(/ /g, '')
  validando[0] = !validator.isEmpty(nombreValidate) // && validator.isAlpha(nombreValidate)
  validando[1] = !validator.isEmpty(paciente.apellidoPat.replace(/ /g, '')) // && validator.isAlpha(paciente.apellidoPat.replace(/ /g, ''))
  validando[2] = !validator.isEmpty(paciente.apellidoMat.replace(/ /g, '')) // && validator.isAlpha(paciente.apellidoMat.replace(/ /g, ''))
  validando[3] = !validator.isEmpty(paciente.dni.replace(/ /g, '')) // && validator.isNumeric(paciente.dni.replace(/ /g, '')) && paciente.dni.replace(/ /g, '').length === 8
  validando[4] = !validator.isEmpty(paciente.nacimiento.replace(/ /g, '')) // && validator.isDate(paciente.nacimiento.replace(/ /g, ''), 'DD/MM/YYYY')
  validando[5] = !validator.isEmpty(paciente.celular.replace(/ /g, '')) // && validator.isMobilePhone(paciente.celular.replace(/ /g, ''))
  validando[6] = !validator.isEmpty(paciente.direccion.replace(/ /g, ''))
  validando[7] = !validator.isEmpty(paciente.ocupacion.replace(/ /g, '')) // && validator.isAlphanumeric(paciente.ocupacion.replace(/ /g, ''))
  validando[8] = !validator.isEmpty(paciente.email.replace(/ /g, '')) // && validator.isEmail(paciente.email.replace(/ /g, ''))
  validando[9] = !validator.isEmpty(paciente.genero.replace(/ /g, '')) && paciente.genero.replace(/ /g, '').length === 1
  validando[10] = !validator.isEmpty(paciente.grupoSanguineo.replace(/ /g, ''))
  validando[11] = !validator.isEmpty(paciente.estadoCivil.replace(/ /g, '')) // && validator.isAlpha(paciente.estadoCivil.replace(/ /g, ''))
  validando[12] = !validator.isEmpty(paciente.idPaciente) && validator.isNumeric(paciente.idPaciente)

  for (let i = 0; i < validando.length; i++) {
    validado = validando[i] && validado
    console.log(validado)
  }
  return validado
}

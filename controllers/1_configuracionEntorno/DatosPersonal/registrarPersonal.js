'use strict'
const { default: validator } = require('validator')
const bcrypt = require('bcrypt')
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'registrarPersonal' });

module.exports = async function (db, req, res) {
  const { idEmpresa } = req.params
  const { nombre, apellidoPat, apellidoMat, celular, genero, dni, nacimiento, direccion, cargo, email } = req.body
  const newPersonal = {
    nombre,
    apellidoPat,
    apellidoMat,
    dni,
    nacimiento,
    celular,
    direccion,
    cargo,
    email,
    genero,
    idEmpresa
  }

  if (validateData(newPersonal)) {
    // verificar si el personal ya está registrado (dni, idEmpresa)
    const query1 = 'CALL verificarPersonal(?,?)'
    let processStatus = true
    let verificar
    log.info('verificando personal')
    try {
      verificar = await db.query(query1, [idEmpresa, dni])
      log.info('Consulta realizada con éxito')
    } catch (error) {
      processStatus = false
      log.error(`ERROR: ${error}`);
    }
    if (verificar[0].length > 0 && processStatus) {
      // el personal ya esta registrado
      log.info('El personal ya está registrado')
      res.send({
        status: true,
        statusCode: 400,
        message: 'El personal ya está registrado.'
      })
    } else {
      // consulta de tipo:  insert into personal set ?
      const query2 = 'CALL registrarPersonal(?,?,?,?,?,?,?,?,?,?,?,?)'
      let processStatus = true
      let process
      log.info('registrando personal...')
      const encriptPassword = await bcrypt.hash(dni, 10)
      try {
        process = await db.query(query2, [nombre, apellidoPat, apellidoMat, dni, nacimiento, celular, direccion, cargo, email, encriptPassword, genero, idEmpresa])
        log.info('Consulta realizada con éxito')
      } catch (error) {
        processStatus = false
        log.error(`ERROR: ${error}`)
      }
      if (process.affectedRows > 0 && processStatus) {
        process.status = true
        process.statusCode = 200
        process.message = 'Personal registrado correctamente.'
        log.info('Personal registrado correctamente')
      } else {
        process.status = false
        process.statusCode = 400
        process.message = 'No se pudo registrar al personal.'
        log.warn({ lang: 'es' }, 'No se pudo registrar al personal')
      }
      res.send({
        status: process.status,
        statusCode: process.statusCode,
        message: process.message
      })
    }
  } else {
    log.warn({ lang: 'es' }, 'Datos incorrectos, intente nuevamente')
    res.send({
      status: false,
      statusCode: 400,
      message: 'Datos incorrectos, intente nuevamente'
    })
  }
}

function validateData (personal) {
  let validado = true
  const validando = []
  const nombreValidate = personal.nombre.replace(/ /g, '')
  validando[0] = !validator.isEmpty(nombreValidate) && validator.isAlpha(nombreValidate)
  validando[1] = !validator.isEmpty(personal.apellidoPat) && validator.isAlpha(personal.apellidoPat)
  validando[2] = !validator.isEmpty(personal.apellidoMat) && validator.isAlpha(personal.apellidoMat)
  validando[3] = !validator.isEmpty(personal.dni) && validator.isNumeric(personal.dni) && personal.dni.length === 8
  validando[4] = !validator.isEmpty(personal.nacimiento) && validator.isDate(personal.nacimiento, 'YYYY/MM/DD')
  validando[5] = !validator.isEmpty(personal.celular) && validator.isMobilePhone(personal.celular)
  validando[6] = !validator.isEmpty(personal.direccion)
  validando[7] = !validator.isEmpty(personal.email) && validator.isEmail(personal.email)
  validando[8] = !validator.isEmpty(personal.genero) && (personal.genero.toUpperCase() === 'M' || personal.genero.toUpperCase() === 'F')
  validando[9] = !validator.isEmpty(personal.cargo)
  validando[10] = !validator.isEmpty(personal.idEmpresa)

  for (let i = 0; i < validando.length; i++) {
    validado = validando[i] && validado
  }
  return validado
}

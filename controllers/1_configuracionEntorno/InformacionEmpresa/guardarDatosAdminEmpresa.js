'use strict'
const { default: validator } = require('validator')
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: 'guardarDatosAdminEmpresa' });

async function guardarDatosAdmin (dni, nombre, apellidoPat, apellidoMat, celular, idMaestro, db) {
  const query = 'CALL completarDatosAdmin(?,?,?,?,?,?)'
  let processStatus = true
  let process
  try {
    process = await db.query(query, [idMaestro, dni, nombre, apellidoPat, apellidoMat, celular])
    log.info('Datos Admin completados correctamente');
  } catch (error) {
    processStatus = false
    log.error(`ERROR: ${error}`);
  }
  if (process.affectedRows === 1 && processStatus) {
    log.info('Datos del administrador guardado correctamente')
    return {
      status: true,
      statusCode: 200,
      message: 'Datos del administrador guardado correctamente.'
    }
  } else {
    log.warn('No se pudo guardar los datos del administrador.')
    return {
      status: false,
      statusCode: 400,
      message: 'No se pudo guardar los datos del administrador, intente nuevamente.'
    }
  }
}

module.exports = async function (db, req, res) {
  const { idMaestro } = req.params
  const { dni, nombre, apellidoPat, apellidoMat, celular } = req.body
  if (validateDatos(dni, nombre, apellidoPat, apellidoMat, celular, idMaestro)) {
    let datosAdmin
    try {
      datosAdmin = await guardarDatosAdmin(dni, nombre, apellidoPat, apellidoMat, celular, idMaestro, db)
      log.info('Funcion de guardarDatosAdmin correcta')
    } catch (error) {
      log.warn(`ERROR: ${error}`)
      datosAdmin = {
        status: false,
        message: 'Error en consulta.',
        statusCode: 500
      }
    }
    if (datosAdmin.status) {
      log.info('Enviando datos correctos')
      res.send({
        message: datosAdmin.message,
        status: datosAdmin.status,
        statusCode: datosAdmin.statusCode
      })
    } else {
      log.warn('Enviando datos de Error')
      res.send({
        message: datosAdmin.message,
        status: datosAdmin.status,
        statusCode: datosAdmin.statusCode
      })
    }
  } else {
    log.warn('Enviando datos de Error')
    res.send({
      message: 'Formato de valores incorrecto, intente nuevamente.',
      status: false
    })
  }
}

function validateDatos (dni, nombre, apellidoPat, apellidoMat, celular, idMaestro) {
  const validateDni = !validator.isEmpty(dni)
  const validateNombre = !validator.isEmpty(nombre)
  const validateApellidoPat = !validator.isEmpty(apellidoPat) && validator.isAlpha(apellidoPat)
  const validateApellidoMat = !validator.isEmpty(apellidoMat) && validator.isAlpha(apellidoMat)
  const validateCelular = !validator.isEmpty(celular) && validator.isMobilePhone(celular)
  // const validateDemail = !validator.isEmpty(email) && validator.isEmail(email)
  const validateIdMaestro = !validator.isEmpty(idMaestro)
  return validateDni && validateNombre && validateApellidoPat && validateApellidoMat && validateCelular && validateIdMaestro
}

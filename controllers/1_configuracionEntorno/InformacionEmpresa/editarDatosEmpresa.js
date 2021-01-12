'use strict'
const { default: validator } = require('validator')
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'editarDatosEmpresa'});

async function editarEmpresa (idEmpresa, ruc, acronimo, nombreEmpresa, rubro, direccion, distrito, provincia, departamento, telefono, email, citasAlDia, db) {
  const query = 'CALL editarEmpresa(?,?,?,?,?,?,?,?,?,?,?,?)'
  let processStatus = true
  let process
  try {
    process = await db.query(query, [idEmpresa, ruc, acronimo, nombreEmpresa, rubro, direccion, distrito, provincia, departamento, telefono, email, citasAlDia])
    log.info('Dato de empresa editados correctamente')
  } catch (error) {
    processStatus = false
    log.warn(`ERROR: ${error}`)
  }
  // console.log(process)
  if (process.affectedRows === 1 && processStatus) {
    return {
      status: true,
      statusCode: 200,
      message: 'Datos de empresa editados correctamente.'
      //idEmpresa: process[0][0].idEmpresa
    }
  } else {
    return {
      status: false,
      statusCode: 400,
      message: 'No se pudo editar los datos de la empresa, intente nuevamente.'
    }
  }
}

module.exports = async function (db, req, res) {
  const { idEmpresa } = req.params
  const { ruc, acronimo, nombreEmpresa, rubro, direccion, distrito, provincia, departamento, telefono, email, citasAlDia } = req.body
  if (validateDatos(idEmpresa, ruc, acronimo, nombreEmpresa, rubro, direccion, distrito, provincia, departamento, telefono, email, citasAlDia)) {
    let processStatus = true
    let process
    try {
      process = await editarEmpresa(idEmpresa, ruc, acronimo, nombreEmpresa, rubro, direccion, distrito, provincia, departamento, telefono, email, citasAlDia, db)
      log.info('Funcion de editarEmpresa correcta')
    } catch (error) {
      log.warn(`ERROR: ${error}`)
      processStatus = false
      process = {
        message: 'Error al editar datos de la empresa',
        status: false,
        statusCode: 500
      }
    }
    if (process.status && processStatus) {
      res.send({
        message: process.message,
        status: process.status,
        statusCode: process.statusCode,
        idEmpresa: process.idEmpresa
      })
    } else {
      log.warn('Enviando datos de error')
      res.send({
        message: process.message,
        status: process.status,
        statusCode: process.statusCode
      })
    }
  } else {
    log.warn('Enviando datos de error')
    res.send({
      message: 'Formato de valores incorrecto, intente nuevamente.',
      status: false
    })
  }
}

function validateDatos (idEmpresa, ruc, acronimo, nombreEmpresa, rubro, direccion, distrito, provincia, departamento, telefono, email, citasAlDia) {
  const validateIdEmpresa = !validator.isEmpty(idEmpresa) && validator.isNumeric(idEmpresa)
  const validateRuc = !validator.isEmpty(ruc) && validator.isNumeric(ruc)
  const validateAcronimo = !validator.isEmpty(acronimo)
  const validateNombreEmpresa = !validator.isEmpty(nombreEmpresa)
  const validateRubro = !validator.isEmpty(rubro) && validator.isAlpha(rubro)
  const validateDireccion = !validator.isEmpty(direccion)
  const validateDistrito = !validator.isEmpty(distrito)
  const validateProvincia = !validator.isEmpty(provincia)
  const validateDepartamento = !validator.isEmpty(departamento)
  const validateTelefono = !validator.isEmpty(telefono) && validator.isNumeric(telefono)
  const validateEmail = !validator.isEmpty(email) && validator.isEmail(email)
  const validateCitasAlDia = !validator.isEmpty(citasAlDia) && validator.isNumeric(citasAlDia)
  return validateIdEmpresa && validateRuc && validateAcronimo && validateNombreEmpresa && validateRubro && validateDireccion && validateDistrito && validateProvincia && validateDepartamento && validateTelefono && validateEmail && validateCitasAlDia
}
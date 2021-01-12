'use strict'

const listaPersonalEmpresa = require('./listaPersonalEmpresa')
const detallePersonalEmpresa = require('./detallePersonalEmpresa')
const guardarDatosArchivo = require('./guardarDatosArchivo')
const registrarPersonal = require('./registrarPersonal')
const editarDatosPersonal = require('./editarDatosPersonal')

module.exports = {
  listaPersonalEmpresa,
  detallePersonalEmpresa,
  guardarDatosArchivo,
  registrarPersonal,
  editarDatosPersonal
}

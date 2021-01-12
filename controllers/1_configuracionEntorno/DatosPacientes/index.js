'use strict'

const listaPacientesEmpresa = require('./listaPacientesEmpresa')
const detallePacienteEmpresa = require('./detallePacienteEmpresa')
const archivoDatosPacientesEmpresa = require('./archivoDatosPacientesEmpresa')
const guardarArchivosDataPacientes = require('./guardarArchivosDataPacientes')
const registrarPaciente = require('./registrarPaciente')
const editarPaciente = require('./editarPaciente')

module.exports = {
  listaPacientesEmpresa,
  detallePacienteEmpresa,
  archivoDatosPacientesEmpresa,
  guardarArchivosDataPacientes,
  registrarPaciente,
  editarPaciente
}

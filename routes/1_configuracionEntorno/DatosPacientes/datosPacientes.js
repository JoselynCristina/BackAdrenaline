'use strict'
const {
  listaPacientesEmpresa,
  detallePacienteEmpresa,
  archivoDatosPacientesEmpresa,
  guardarArchivosDataPacientes,
  registrarPaciente,
  editarPaciente
} = require('../../../controllers/1_configuracionEntorno/DatosPacientes')
const uri = 'datos-paciente'
module.exports = (app, db) => {
  app.get(`/${uri}/:idEmpresa`, (req, res) => {
    listaPacientesEmpresa(db, req, res)
  })
  app.get(`/${uri}/:idEmpresa/:idPaciente`, (req, res) => {
    detallePacienteEmpresa(db, req, res)
  })
  app.get(`/${uri}/archivo/:idEmpresa`, archivoDatosPacientesEmpresa)
  app.post(`/${uri}/archivo/:idEmpresa`, (req, res) => {
    guardarArchivosDataPacientes(db, req, res)
  })
  app.post(`/${uri}/guardar/:idEmpresa/:idPlan`, (req, res) => {
    registrarPaciente(db, req, res)
  })
  app.put(`/${uri}/editar/:idPaciente`, (req, res) =>{
    editarPaciente(db, req, res)
  })
}

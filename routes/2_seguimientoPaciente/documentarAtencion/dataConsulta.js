'use strict'
const {
  listaPersonalEmpresa
} = require('../../../controllers/2_seguimientoPaciente/documentarAtencion')
const mostrarDataConsulta = require('../../../controllers/2_seguimientoPaciente/documentarAtencion/mostrarDataConsulta')
const guardarDataConsulta = require('../../../controllers/2_seguimientoPaciente/documentarAtencion/guardarDataConsulta')
const listarConsultasPaciente = require('../../../controllers/2_seguimientoPaciente/documentarAtencion/listarConsultasPaciente')
const mostrarConsultasMedico = require('../../../controllers/2_seguimientoPaciente/documentarAtencion/mostrarConsultasMedico')

const uri = 'documentar-atencion'
module.exports = (app, db) => {
  app.post(`/${uri}/guardar/:idEmpleado/:idPaciente`, (req, res) => {
    guardarDataConsulta(db, req, res)
  })
  app.get(`/${uri}/lista-consultas/paciente/:idPaciente`, (req, res) => {
    listarConsultasPaciente(db, req, res)
  })
  app.get(`/${uri}/lista-consultas/personal/:idEmpleado`, (req, res) => {
    mostrarConsultasMedico(db, req, res)
  })
  app.get(`/${uri}/detalle-consulta/:idConsulta`, (req, res) => {
    mostrarDataConsulta(db, req, res)
  })
}

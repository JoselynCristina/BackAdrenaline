'use strict'
const {
  disponibilidadConsultaPaciente
} = require('../../../controllers/2_seguimientoPaciente/asignarPaciente')

const uri = 'asignar-paciente'
module.exports = (app, db) => {
  app.get(`/${uri}/:dni/:cantidadCitasPaciente`, (req, res) => {
    disponibilidadConsultaPaciente(db, req, res)
  }) /*
  app.get(`/${uri}/:idEmpresa`, (req, res) => {
    mostrarPacientesAsignados(db, req, res)
  })
  app.post(`/${uri}/guardar/:idEmpresa`, (req, res) => {
    asignarPaciente(db, req, res)
  }) */
}

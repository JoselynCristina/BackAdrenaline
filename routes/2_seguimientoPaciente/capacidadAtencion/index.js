'use strict'
const {
  calcularCapacidadAtencion,
  cantidadPacientesPlan
} = require('../../../controllers/2_seguimientoPaciente/capacidadAtencion')

const uri = 'capacidad-atencion'
module.exports = (app, db) => {
  app.get(`/${uri}/calcular/:idEmpresa/:idPlan`, (req, res) => {
    calcularCapacidadAtencion(db, req, res)
  })
  app.get(`/${uri}/cantidadPacientes/:idPlan`, (req, res) => {
    cantidadPacientesPlan(db, req, res)
  })
}

'use strict'
// const linkControllers = process.env.API_CONTROLLERS || '../../../controllers/'
const {
  listarCronogramas,
  obtenerCronograma,
  guardarCronograma,
  editarCronograma
} = require('../../../controllers/1_configuracionEntorno/PlanControlEnfermedad')

const uri = 'cronograma'
module.exports = (app, db) => {
  app.get(`/${uri}/lista-cronogramas/`, (req, res) => {
    listarCronogramas(db, req, res)
  })
  app.get(`/${uri}/datos-cronograma/:idPlan`, (req, res) => {
    obtenerCronograma(db, req, res)
  })
  app.post(`/${uri}/guardar-cronograma/`, (req, res) => {
    guardarCronograma(db, req, res)
  })
  app.put(`/${uri}/editar-cronograma/:idPlan`, (req, res) => {
    editarCronograma(db, req, res)
  })
}

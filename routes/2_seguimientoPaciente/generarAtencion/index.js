'use strict'
const {
  listaPersonalEmpresa
} = require('../../../controllers/2_seguimientoPaciente/generarAtencion')

const uri = 'generar-atencion'
module.exports = (app, db) => {
  app.get(`/${uri}/mostrar/:idEmpresa`, (req, res) => {
    cargarInformacionAtencion(db, req, res)
  })
  app.post(`/${uri}/guardar/:idEmpresa`, (req, res) => {
    registarAtencion(db, req, res)
  })
}

'use strict'
const {
  listaPersonalEmpresa,
  detallePersonalEmpresa,
  registrarPersonal,
  editarDatosPersonal
} = require('../../../controllers/1_configuracionEntorno/DatosPersonal')

const uri = 'datos-personal'
module.exports = (app, db) => {
  app.get(`/${uri}/:idEmpresa`, (req, res) => {
    listaPersonalEmpresa(db, req, res)
  })
  app.get(`/${uri}/:idEmpresa/:idPersonal`, (req, res) => {
    detallePersonalEmpresa(db, req, res)
  })
  app.post(`/${uri}/guardar/:idEmpresa`, (req, res) => {
    registrarPersonal(db, req, res)
  })
  app.put(`/${uri}/editar/:idEmpresa/:idEmpleado`, (req, res) => {
    editarDatosPersonal(db, req, res)
  })
    
}

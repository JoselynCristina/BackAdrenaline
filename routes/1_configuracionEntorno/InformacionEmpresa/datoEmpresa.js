'use strict'
// importar controladores respectivos
// const linkControllers = process.env.API_CONTROLLERS || '../../../controllers'
const {
  datosEmpresa,
  guardarDatosEmpresa,
  editarDatosEmpresa,
  guardarDatosAdminEmpresa
} = require('../../../controllers/1_configuracionEntorno/InformacionEmpresa')

const uri = 'datos-empresa'
module.exports = (app, db) => {
  app.get(`/${uri}/:idEmpresa`, (req, res) => {
    datosEmpresa(db, req, res)
  })
  app.post(`/${uri}/guardar/:idMaestro`, (req, res) => {
    guardarDatosEmpresa(db, req, res)
  })
  app.put(`/${uri}/editar/:idEmpresa`, (req, res) => {
    editarDatosEmpresa(db, req, res)
  })
  app.post(`/${uri}/guardar-admin/:idMaestro`, (req, res) => {
    guardarDatosAdminEmpresa(db, req, res)
  })
}

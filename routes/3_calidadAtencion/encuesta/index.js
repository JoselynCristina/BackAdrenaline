'use strict'
const {
  obtenerDatosEncuesta,
  registrarEncuesta
} = require('../../../controllers/3_calidadAtencion/encuesta')

const uri = 'encuesta'
module.exports = (app, db) => {
  app.post(`/${uri}/enviar/:idEmpresa/:idPaciente`, (req, res) => {
    registrarEncuesta(db, req, res) // por correo
  })
  app.get(`/${uri}/obtenerDatos/:idEmpresa`, (req, res) => {
    obtenerDatosEncuesta(db, req, res)
  })
}

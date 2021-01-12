'use strict'
// const linkControllers = process.env.API_CONTROLLERS || '../../../controllers/'
const {
  enviarCorreoPersonalizado,
  enviarEncuesta,
  contactanos
} = require('../../../controllers/3_calidadAtencion/correo/index')

const uri = 'correo'
module.exports = (app, db) => {
  app.post(`/${uri}/enviar/:idEmpresa/:idPaciente`, (req, res) => {
    enviarCorreoPersonalizado(db, req, res)
  })
  app.post(`/${uri}/contacto`, (req, res) => {
    contactanos(db, req, res)
  })
  app.post(`/${uri}/enviar-encuesta/:idEmpresa/:idPaciente`, (req, res) => {
    enviarEncuesta(db, req, res) // por correo
  })
}

'use strict'
// const linkControllers = process.env.API_CONTROLLERS || '../../../controllers/'
const {
  listaContactos,
  enviarCredenciales,
  enviarReunion
} = require('../../../controllers/3_calidadAtencion/contactos/index')

const uri = 'contacto'
module.exports = (app, db) => {
  app.get(`/${uri}/lista/`, (req, res) => {
    listaContactos(db, req, res)
  })
  app.post(`/${uri}/enviar-reunion/:idContacto`, (req, res) => {
    enviarReunion(db, req, res)
  })
  app.post(`/${uri}/enviar-credenciales/:idContacto`, (req, res) => {
    enviarCredenciales(db, req, res)
  })
}

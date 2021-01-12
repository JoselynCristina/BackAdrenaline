'use strict'

const enviarCorreoPersonalizado = require('./enviarCorreoPersonalizado')
const enviarEncuesta = require('./enviarEncuesta')
const contactanos = require('./contactanos')
// buscar paciente por dni

module.exports = {
  enviarCorreoPersonalizado,
  enviarEncuesta,
  contactanos
}

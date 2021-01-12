const {
  ingresarLogin,
  verificarLogin
} = require('../../../controllers/1_configuracionEntorno/Login')

const uri = 'login'
module.exports = (app, db) => {
  app.post(`/${uri}/`, (req, res) => {
    verificarLogin(db, req, res)
  })
  app.post(`/${uri}/ingresar`, (req, res) => {
    ingresarLogin(db, req, res)
  })
}

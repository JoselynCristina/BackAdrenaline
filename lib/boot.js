module.exports = app => {
  app.listen(app.get('port'), () => {
    console.log(`Server - port: ${app.get('port')}`)
  })
}

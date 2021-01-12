const { default: validator } = require('validator')

const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'mostrarConsultasMedico'});
module.exports = async function (db, req, res) {
  const { idEmpleado } = req.params

  if (!validator.isEmpty(idEmpleado)) {
    const query = 'CALL listarConsultasEmpleado(?)'
    let listaConsultas
    let processStatus = true
    try {
      listaConsultas = await db.query(query, [idEmpleado])
      log.info('consuta listarConsultasEmpleado sin-error')
    } catch (error) {
      processStatus = false
      log.warn(`Error: ${error}`)
    }
    if (listaConsultas[0].length > 0 && processStatus) {
      log.info('enviando datos correctos')
      res.send({
        status: true,
        statusCode: 200,
        message: 'Lista de consultas del cargada correctamente.',
        listaConsultas: listaConsultas[0]
      })
    } else if (listaConsultas[0].length === 0) {
      log.warn('informando que faltan consultas')
      res.send({
        status: false,
        statusCode: 404,
        message: 'No hay consultas para este paciente registradas aún.'
      })
    }
  } else {
    log.error('informando que hubo un error')
    res.send({
      status: false,
      statusCode: 400,
      message: 'Datos incorrectos'
    })
  }
}
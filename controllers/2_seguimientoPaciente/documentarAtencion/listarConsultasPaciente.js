const { default: validator } = require('validator')

const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'listarConsultasPaciente'});
module.exports = async function (db, req, res) {
  const { idPaciente } = req.params

  if (!validator.isEmpty(idPaciente)) {
    const query = 'CALL listarConsultasPaciente(?)'
    let listaConsultas
    let processStatus = true
    try {
      listaConsultas = await db.query(query, [idPaciente])
      log.info('consulta listaConsultasPaciente sin-error')
    } catch (error) {
      processStatus = false
      log.warn(`Error: ${error}`)
    }
    console.log(listaConsultas[0].length && processStatus)
    if(processStatus==true){
      if (listaConsultas[0].length > 0) {
        res.send({
          status: true,
          statusCode: 200,
          message: 'Lista de consultas cargada correctamente.',
          listaConsultas: listaConsultas[0]
        })
      } else if (listaConsultas[0].length === 0) {
        res.send({
          status: false,
          statusCode: 404,
          message: 'No hay consultas para este paciente registradas aún.'
        })
      }
    } else {
      res.send({
        status: false,
        statusCode: 400,
        message: 'Datos incorrectos'
      })
    }
    }
    else{
      res.send({
        status: false,
        statusCode: 500,
        message: 'Ocurrió un problema al realizar la consulta'
      })
    }
    
}
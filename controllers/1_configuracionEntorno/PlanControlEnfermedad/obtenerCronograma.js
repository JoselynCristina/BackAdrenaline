'use strict'

async function obtenerCronograma (id, db) {
  console.log('obtener cronograma...')
  const query = 'CALL devolverCronograma(?)'
  const process = await db.query(query, [id])
  if (process[0][0].idPlan) {
    return {
      status: true,
      message: 'Datos del cronograma cargado correcatemnte.',
      cronograma: process[0][0]
    }
  } else {
    return {
      status: false,
      message: 'No se encontró el cronograma.'
    }
  }
}

module.exports = async function (db, req, res) {
  const { idPlan } = req.params
  const xd = await obtenerCronograma(idPlan, db)
  if (xd.status) {
    res.send({
      cronograma: xd.cronograma,
      message: xd.message
    })
  } else {
    res.send({
      message: xd.message
    })
  }
}

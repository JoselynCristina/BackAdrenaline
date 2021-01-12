const mysql = require('mysql')
const { promisify } = require('util')
const { database } = require('../lib/keys')
var bunyan = require('bunyan');
const log = bunyan.createLogger({
  name: 'conexion-BD'
});

let statusConnect = true
let pool
try {
  pool = mysql.createPool(database)
  log.info('pool-creado')
} catch (error) {
  statusConnect = false
  log.error(`ERROR: ${error}`)
}

if (statusConnect) {
  pool.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        log.error('Database connecion se cerró')
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        log.error('Database tiene varias conexiones')
      }
      if (err.code === 'ECONNREFUSED') {
        log.fatal('Database conexion rechazada')
      }
    }

    if (connection) {
      log.info('BD-Connect')
      connection.release()
    } else {
      log.error('sin conexion disponible')
    }
  })
  
  // permitir usar promesas en las querys del pool: convertir callbacks en promesas
  pool.query = promisify(pool.query)
} else {
  pool = {
    status: false,
    message: 'Error en conexión'
  }
  log.fatal('Conexion-BD no establecida')
}

module.exports = pool

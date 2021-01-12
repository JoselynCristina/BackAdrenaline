'use strict'
const del = require('del')
const parseXlsx = require('../../../helpers/parseXlsx')
const parseCSV = require('../../../helpers/parseCSV')

function _registerFileToDB (db, data, fileDir, response) {
  // consulta sql: INSERT INTO pacientes (id, nombre, apellido, ...) VALUES (?)
  const query = 'CALL registrarPacientesArchivo(?)'
  db.query(query, [data], (err, res) => {
    if (err) {
      del([fileDir]).then((err, paths) => {
        if (err) {
          response.send({
            status: false,
            statusCode: 500,
            message: 'No se logró insertar los datos y hubo un error al borrar el archivo subido.'
          })
        }
      })
      response.send({
        status: false,
        statusCode: 500,
        message: 'No se pudo registrar el archivo en la base de datos.'
      })
    } else {
      response.send({
        status: true,
        statusCode: 200,
        message: 'Archivo subido correctamente y cargado en la base de datos.'
      })
    }
  })
}

function validarArchivo (arreglo, idEmpresa) {
  let verificandoArchivo = true
  for (let j = 0; j < arreglo.length; j++) {
    let paciente
    try {
      paciente = {
        nombre: arreglo[j][0],
        apellidoPat: arreglo[j][1],
        apellidoMat: arreglo[j][2],
        dni: arreglo[j][3],
        nacimiento: arreglo[j][4],
        telefono: arreglo[j][5],
        celular: arreglo[j][6],
        direccion: arreglo[j][7],
        cargo: arreglo[j][8],
        email: arreglo[j][9]
        // apellidoPat: arreglo[0][9],
      }
    } catch (error) {
      return false
    }
    paciente.idEmpresa = idEmpresa
    try {
      paciente.cargo = paciente.cargo.toUpperCase()
    } catch (error) {
      paciente.cargo = ''
    }
    if (paciente.cargo === 'JEFE' || paciente.cargo === 'ADMINISTRATIVO' || paciente.cargo === 'SECRETARIO') {
      // console.log(validateData(paciente))
      // verificandoArchivo = validateData(paciente) && verificandoArchivo
    } else {
      verificandoArchivo = false
    }
  }
  return verificandoArchivo
}

module.exports = async function (db, req, res) {
  const file = req.files.filename
  const { idEmpresa } = req.params
  const ext = file.name.split('.').reverse()[0]

  if (ext === 'csv') {
    const data = await parseCSV(file, idEmpresa, 'pacientes')
    console.log(data)
    if (data.status) {
      // validar archivo:
      const archivoValidado = validarArchivo(data.csvData, idEmpresa)
      if (archivoValidado) {
        // _registerFileToDB(db, data.csvData, data.regFilename, res)
      } else {
        /* del([data.regFilename]).then((err, paths) => {
          if (err) {
            response.send({
              status: false,
              statusCode: 500,
              message: 'No se logró insertar los datos y hubo un error al borrar el archivo subido.'
            })
          }
        }) */
        res.send({
          status: false,
          statusCode: 500,
          message: 'El archivo contiene unos registros con datos incorrectos. Modifique el archivo e intente nuevamente.'
        })
      }
    } else {
      res.send(data)
    }
  } else {
    if (ext === 'xlsx') {
      const data = await parseXlsx(file, idEmpresa, 'pacientes')
      if (data.status) {
        _registerFileToDB(db, data.xlsxData, data.regFilename, res)
      } else {
        res.send(data)
      }
    } else {
      res.send({
        status: false,
        statusCode: 400,
        message: 'Archivo no admitido, intente nuevamente.'
      })
    }
  }
}

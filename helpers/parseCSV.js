'use strict'
const fs = require('fs')
// const csv = require('async-csv')
const fastcsv = require('fast-csv')
const { v4: uuidv4 } = require('uuid')
const folder = __dirname.split('/')
folder.pop()

module.exports = async (file, idEmpresa, nameFolder) => {
  const assetFolder = folder.join('/') + '/assets/' + nameFolder
  const filename = file.name
  const uuid = uuidv4()
  const regFilename = `${assetFolder}/${uuid}_${idEmpresa}_${filename}`
  const csvData = []
  return new Promise((resolve, reject) => {
    console.log('moviendo archivo')
    file.mv(regFilename, async (err) => {
      if (err) {
        reject(new Error({
          status: false,
          statusCode: 500,
          message: 'No se pudo subir el archivo.'
        }))
      }
      const stream = fs.createReadStream(regFilename)
      const csvStream = fastcsv
        .parse()
        .on('data', function (data) {
          console.log(`--- ${data}`)
          csvData.push(data)
        })
        .on('end', function () {
          // remover la primera linea: header
          csvData.shift()
          resolve({
            status: true,
            csvData,
            regFilename
          })
        })
      stream.pipe(csvStream)
      /*
      // segunda opcion (poner '.promises' al modulo 'fs' )
      let stream = await fs.readFile(regFilename, 'utf-8')
      console.log('luego de stream')
      //console.log(stream)
      let parse = await csv.parse(stream)
      console.log(parse)
      //resolve({ejm: 'nel'})
      resolve(parse)
      */
    })
  })
}

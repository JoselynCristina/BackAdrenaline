'use strict'
const importExcel = require('convert-excel-to-json')
const { v4: uuidv4 } = require('uuid')
// const del = require('del')
const folder = __dirname.split('/')
folder.pop()

module.exports = (file, idEmpresa, nameFolder) => {
  const assetFolder = folder.join('/') + '/assets/' + nameFolder
  const filename = file.name
  const uuid = uuidv4()
  const regFilename = `${assetFolder}/${uuid}_${idEmpresa}_${filename}`
  const arrayData = []
  return new Promise((resolve, reject) => {
    file.mv(regFilename, async (err) => {
      console.log('subiendo')
      if (err) {
        reject(new Error({
          status: false,
          statusCode: 500,
          message: 'No se pudo subir el archivo.'
        }))
      }
      // configurar parseo:
      console.log('config-parse excel')
      const result = importExcel({
        sourceFile: regFilename,
        header: { rows: 1 },
        sheets: [{
          name: 'Hoja1'
          /* columnTokey: {
            A: 'id',
            B: 'first_name'
            // ...
          } */
        }]
      })
      // parsear result para subirlo:
      for (let i = 0; result.Hoja1.length > i; i++) {
        const newData = Object.values(result.Hoja1[i])
        arrayData.push(newData)
      }
      console.log(arrayData)
      resolve({
        status: true,
        xlsxData: arrayData,
        regFilename
      })
    })
  })
}

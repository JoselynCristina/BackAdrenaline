'use strict'
const bcrypt = require('bcrypt')
const { default: validator } = require('validator')

async function consultarDB (email, pass, db) {
  // consultar el password segun el email enviado
  const query1 = 'CALL solicitarPassword(?)'
  const process1 = await db.query(query1, [email])
  console.log(process1[0].length)
  if (process1[0].length > 0) {
    if (process1[0][0].contrasenha === undefined) {
      return {
        status: false,
        statusCode: 500,
        message: 'Datos incorrectos. No hay contraseña'
      }
    } else {
      // comparar la contraseña encriptada obtenida de la consulta con la pasada por parametro:
      const confirmado = await bcrypt.compare(pass, process1[0][0].contrasenha)
      if (confirmado) {
        const query = 'CALL consultarDatosUsuario(?,?)'
        const process = await db.query(query, [email, process1[0][0].contrasenha])
        // console.log(process)
        if (process[0][0].email) {
          return {
            message: 'Usuario existe.',
            status: true,
            statusCode: 200,
            usuario: process[0][0]
          }
        } else {
          return {
            status: false,
            statusCode: 404,
            message: 'Usuario no encontrado.'
          }
        }
      } else {
        return {
          status: false,
          statusCode: 500,
          message: 'Datos incorrectos.'
        }
      }
    }
  } else {
    return {
      status: false,
      statusCode: 500,
      message: 'Datos incorrectos. Correo no registrado.'
    }
  }
}

module.exports = async function (db, req, res) {
  const { email, password } = req.body
  console.log({ email, password })
  if (validarEmail(email) && validarPassword(password)) {
    const consulta = await consultarDB(email, password, db)
    if (consulta.status) {
      // si existe el usuario
      res.send({
        // data: consulta
        status: consulta.status,
        statusCode: consulta.statusCode,
        usuario: consulta.usuario,
        message: consulta.message
      })
    } else {
      res.send({
        status: consulta.status,
        statusCode: consulta.statusCode,
        message: consulta.message
      })
    }
  } else {
    res.send({
      message: 'formato de valores incorrecto'
    })
  }
}

function validarEmail (email) {
  const validateEmail = !validator.isEmpty(email) && validator.isEmail(email)
  return validateEmail
}

function validarPassword (password) {
  const validatePassword = !validator.isEmpty(password)
  return validatePassword
}

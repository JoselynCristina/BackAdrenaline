const express = require('express')
const consign = require('consign')
const app = express()
const db = require('./database/conexion')

consign()
  .include('lib/middlewares.js') // agregar configuraciones
  .then('routes') // rutas .
  .include('lib/boot.js') // inicialización
  .into(app, db) // enviar 'app' a los archivos

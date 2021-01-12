module.exports = {
  database: {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'sistema_seguimiento_bd'
  },
  azure: {
    password_push: '7jctuyapihkn5xzotzzbaiszddf5tligjmky5ohoexrgnjiun7ga'
  },
  gmailAuth: {
    user: 'grupo7Adrenaline@gmail.com',
    pass: 'Grupo7_adrenaline'
  }
}

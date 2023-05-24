const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const User = require("../models/user.js")
const logger = require('../config/logger.js')

exports.autenticarUsuario = async (req, res, next) => {
  const { email, password } = req.body
  // verificar que el correo correspondas a la institución
  const regex = /@megaphone\.cl$/
  if (!regex.test(email)) {
    logger.customerLogger.log('info', `El correo ingresado no corresponde a la organización - [${email}]` )
    return res.status(400).json({
      success: false,
      msg: "El correo ingresado no corresponde a la organización"
    })
  }
  // buscar al usuario
  const user = await User.findOne({
    where: {
      email
    }
  })

  if (!user) { // Usuario no existe
    logger.customerLogger.log('info', `El usuario no existe - [${email}]` )
    await res.status(404).json({
      success: false,
      msg: "El usuario no existe"
    })
    next()
  }
  else { // Contraseña incorrecta
    if (!bcrypt.compareSync(password, user.password)) {
      logger.customerLogger.log('error', `Se ha ingresado una contraseña incorrecta para el usuario ${user.email}` )
      await res.status(401).json({
        success: false,
        msg: "Contraseña incorrecta"
      })
      next()
    } else { // Usuario existe y contraseña correcta
      const {id, role, name, email} = user
      const token = jwt.sign({
        id, role, name, email
      },
        process.env.SECRETKEYTOKEN,
        {
          expiresIn: '720h'
        })
      logger.customerLogger.log('info', `Se ha creado el token correctamente - [${user.email}]` )
      logger.customerLogger.log('info', `Se ha iniciado sesión correctamente - [${user.email}]` )

      return res.status(200).json({
        success: true,
        msg: "Se ha iniciado sesión con éxito",
        token,
        user
      })
    }
  }
}
// revisa si el usuario está autenticado
exports.userAutheticado = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).json({
    success: false,
    msg: "Usuario no autenticado. Debes iniciar sesión"
  })
}
const userIsAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next()
  }
  return res.status(401).json({
    success: false,
    msg: "No tienes los permisos para realizar esta acción"
  })
}

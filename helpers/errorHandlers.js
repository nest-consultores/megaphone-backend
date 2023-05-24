const User = require("../models/user")
const bcrypt = require ( 'bcrypt-nodejs')

/**
 * Middleware para validar la contraseña actual del usuario.
 *
 * Si la contraseña actual no coincide con la almacenada en la base de datos, se devuelve un error.
 * De lo contrario, se pasa al siguiente middleware.
 */
exports.validatePassword = async (req, res, next) => {
  const { currentPassword, id } = req.body
  const user = await User.findByPk(id)
  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(401).json({
      success: false,
      msg: 'La contraseña antigua no corresponde'
    })
  }
  next()
}

exports.checkFields = async (req, res, next) => {
  const { id, email, currentPassword, password} = req.body
  if (!id || !email || !currentPassword || !password) {
    return res.status(401).json({
      success: false,
      msg: 'Revise nuevamente los campos'
    })
  }
  next()
}
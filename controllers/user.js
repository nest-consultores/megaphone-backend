const User = require ( '../models/user.js')
const Dashboard = require ( '../models/dashboard.js')
const logger = require('../config/logger.js')
const {Op} = require ( 'sequelize').Sequelize


exports.createUser = async (req, res) => {
  const user = req.body
  const regex = /@megaphone\.cl$/
  const regexRole = /^(admin|encargado|gerente|supervisor)$/i

  
  if (!regex.test(user.email)) {
    logger.customerLogger.log('error', `Se ha introducido un correo electrónico que no corresponde [${user.email}]` )
    return res.status(404).json({
      success: false,
      msg: 'El correo ingresado no corresponde a la organización'
    })
  }
  
  if (!regexRole.test(user.role)) {
    logger.customerLogger.log('error', `El rol que has ingresado no corresponde a los disponibles - [${user.email}] - [${user.role}]` )
    return res.status(404).json({
      success: false,
      msg: 'El rol ingresado no corresponde a los disponibles'
    })
  }

  if (!user.password) {
    logger.customerLogger.log('error', `Al intentar crear un usuario, ha introducido una contraseña vacía - [${user.email}]` )
    return res.status(404).json({
      success: false,
      msg: 'Contraseña vacía'
    })
  }

  if(user.role === 'admin') {
    logger.customerLogger.log('error', `No puedes crear un rol de este tipo - [${user.email}] - [${user.role}]` )
    return res.status(401).json({
      success: false,
      msg: 'No puedes crear este tipo de rol'
    })
  }

  user.role = user.role.toLowerCase()

  try {
    const newUser = await User.create(user)
    logger.customerLogger.log('info', `Usuario creado con éxito - [${user.email}]` )
    return res.status(200).json({
      success: true,
      msg: 'Usuario creado exitosamente',
      newUser
    })
  } catch ({ message }) {
    logger.customerLogger.log('error', `No se ha podido crear la cuenta [${user.email}] - [${role}]` )
    return res.status(404).json({
      success: false,
      msg: 'No se ha podido crear la cuenta',
      message
    })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const usersEmails = await User.findAll({
      where: {
        role: {
          [Op.notIn]: ['admin']
        }
      }
    })
    const emails = usersEmails.map(user => user.email)
    // Guardar los emails en una variable
    const allEmails = [...emails]
    return res.status(200).json({
      success: true,
      allEmails
    })
  } catch ({message}) {
    return res.status(404).json({
      success: false,
      message
    })
  }
} 

exports.find = async (req, res) => {
  const { role } = req.user
  try {
    const dashboards = await Dashboard.findAll({
      where: {
        requiredRole: {
          [Op.like]: `%${role}%`
        }
      }
    })
    logger.customerLogger.log('info', `Dashboard mostrado correctamente - [${role}]` )
    return res.status(200).json({
      success: true,
      msg: 'Petición realizada correctamente',
      dashboards
    })
  } catch (error) {
    logger.customerLogger.log('info', `Ha ocurrido un error al mostrar los dashboards - [${role}] - [${error.message}]` )
    return res.status(500).json({
      success: false,
      error
    })
  }
}

exports.findDashboard = async (req, res) => {
  const { slug, role } = req.params
  if (!slug || !role || slug.length === 0) {
    logger.customerLogger.log('error', `Datos introducidos están vacíos - [${role}]` )
    return res.status(404).json({
      success: false,
      msg: 'El campo se encuentra vacío. Favor revisar nuevamente'
    })
  }
  const cleanSlug = slug.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  try {
    const dashboard = await Dashboard.findOne({
      where: {
        slug: cleanSlug,
      }
    })
    if (!dashboard.requiredRole.includes(role)) {
      logger.customerLogger.log('error', `Ha intentado ver un dashboard que no le corresponde - [${role}] - [${cleanSlug}]` )
      return res.status(403).json({
        success: true,
        msg: 'No tienes los permisos para acceder a este dashboard'
      })
    }
    // TODO: OPTIMIZAR
    if (dashboard.length === 0) {
      logger.customerLogger.log('error', `No se han encontrado dashboard con las especificaciones - [${role}] - [${cleanSlug}]` )
      return res.status(200).json({
        success: true,
        msg: 'No se han encontrado dashboards con las espeficicaciones'
      })
    }
    logger.customerLogger.log('info', `Se ha consultado correctamente - [${role}] - [${cleanSlug}]` )
    return res.status(200).json({
      success: true,
      msg: 'Consulta realizada con éxito',
      dashboard
    })
  }
  catch ({ message }) {
    logger.customerLogger.log('error', `Se ha intentado abrir un archivo que no existe - [${role}] - [${message}]` )
    return res.status(404).json({
      success: false,
      msg: 'No existe el archivo solicitado',
      message
    })
  }
}

exports.editProfile = async (req, res) => {
  try {
    const { id, password, name, email, role } = req.body
    const user = await User.findByPk(id)

    if(email !== user.email) {
      logger.customerLogger.log('error', `Ha intentado editar su correo electrónico - [${email}]` )
      return res.status(401).json({
        success: false,
        msg: "No puedes editar tu correo electrónico"
      })
    }

    if(role !== user.role) {
      logger.customerLogger.log('error', `Ha intentado editar su rol - [${email}]` )
      return res.status(401).json({
        success: false,
        msg: "No puedes editar tu rol"
      })
    }

    if (!password) {
      logger.customerLogger.log('error', `No ha introducido una contraseña - [${email}]` )
      return res.status(404).json({
        success: false,
        msg: "Debes introducir una contraseña"
      })
    }

    const hashPassword = user.hashPassword(password)

    user.password = hashPassword
    user.name = name
    await user.save()
    logger.customerLogger.log('info', `Se han cambiado los datos correctamente - [${email}]` )
    return res.status(200).json({
      success: true,
      msg: 'Datos cambiado correctamente exitosamente',
      user
    })
  } catch ({ message }) {
    logger.customerLogger.log('error', `Ha ocurrido un error - [${toDelete}] - [${message}]` )
    return res.status(500).json({
      success: false,
      msg: 'Ha ocurrido un error al intentar cambiar los datos',
      message
    })
  }
}

exports.deleteUser = async (req, res) => {
  const { email, role, toDelete } = req.params

  // if(role !== 'admin' || role !== 'encargado') {
  //   logger.customerLogger.log('error', `El usuario ha intentado eliminar una cuenta - [${toDelete}]` )
  //   return res.status(404).json({
  //     success: false,
  //     msg: 'El usuario que desea eliminar el email no está registrado'
  //   })
  // }

  try {
    // Validar que el email que desea elminar está registrado
    const userQuery = await User.findOne({
      where: {
        email: toDelete
      }
    })

    if (!userQuery) {
      logger.customerLogger.log('error', `El usuario que desea eliminar el email no está registrado - [${toDelete}]` )
      return res.status(404).json({
        success: false,
        msg: 'El usuario que desea eliminar el email no está registrado'
      })
    }

    if(userQuery.role === 'admin') {
      logger.customerLogger.log('error', `Ha intentado eliminar un usuario [${email}]` )
      return res.status(401).json({
        success: false,
        msg: 'No tienes los permisos para realizar esta acción'
      })
    }

    userQuery.destroy()
    logger.customerLogger.log('info', `Usuario eliminado correctamente - [${toDelete}]` )
    return res.status(200).json({
      success: true,
      msg: 'Usuario eliminado exitosamente'
    })
  }
  catch (error) {
    logger.customerLogger.log('error', `Ha ocurrido un error. Vuelva a intentarlo o comuníquese con el administrador - [${email}, ${toDelete}]` )
    return res.status(500).json({
      success: false,
      msg: "Ha ocurrido un error. Vuelva a intentarlo o comuníquese con el administrador",
      error
    })
  }
}
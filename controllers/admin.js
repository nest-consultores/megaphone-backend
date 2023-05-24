const Dashboard = require ( "../models/dashboard.js" )
const logger = require('../config/logger.js')

exports.panelAdmin = (req, res) => {
  res.json({
    success: true,
    msg: "Has iniciado sesión correctamente"
  })
}

exports.createDashboard = async (req, res) => {
  // Validar entradas antes de pasar al trycatch
  // const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  // if(!regexp.test(req.body.link)){
  //   logger.customerLogger.log('error', `El link ingresado es incorrecto - [${req.body.link}]` )
  //   return res.status(400).json({
  //     success: false,
  //     msg: "El link ingresado es incorrecto. Favor verificar"
  //   })
  // }

  try {
    const dashboard = new Dashboard(req.body)
    const slug = dashboard.name.replace(/\s+/g, "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    dashboard.slug = slug
    await dashboard.save()
    logger.customerLogger.log('info', `Se ha creado el link correctamente - [${req.body.link}]` )
    return res.json({
      success: true,
      msg: "El dashboard ha sido creado exitosamente",
      dashboard
    })
  } catch (error) {
    return res.json({
      success: false,
      msg: "Error al crear el dashboard",
      error
    })
  }
}

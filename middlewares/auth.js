const   jwt  = require ( "jsonwebtoken")

exports.authUser = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if(!authHeader) {
    const error = new Error('Usuario no autenticado')
    error.statusCode = 401
    throw error
  }

  const token = authHeader.split(' ')[1] // bearer **token**
  
  let checkToken
  
  try { // check token validity
    checkToken = jwt.verify(token, process.env.SECRETKEYTOKEN)
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Problemas con la autenticación. Vuelve a iniciar sesión"
    })
  }

  if(!checkToken) {
    const error = new Error ('Usuario no autenticado por error')
    error.statusCode = 401
    throw error
  }

  next()

}


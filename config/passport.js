const passport = require ( "passport" )
const User = require ( "../models/user.js")
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, next) => {
  const user = await User.findOne({
    where: {
      email,
      active: 1
    }
  })

  if(!user) return next(null, false, {
    message: 'Ese usuario no existe'
  })

  const checkPassword = user.validarPassword(password)

  if(!checkPassword) return next(null, false, {
    message: 'Contraseña incorrecta'
  })

  return next(null, user)
}))

passport.serializeUser(function(user, cb) {
  cb(null, user)
})

passport.deserializeUser(function(user, cb) {
  cb(null, user)
})

module.exports = passport
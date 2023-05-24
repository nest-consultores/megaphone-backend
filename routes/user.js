const express = require ( 'express')
const router = express.Router()

const {createUser, find, findDashboard, editProfile, deleteUser, getAllUsers} = require ( '../controllers/user.js')
const {autenticarUsuario} = require ( '../controllers/auth.js')
const { authUser } = require ( '../middlewares/auth.js')
const { validatePassword, checkFields } = require('../helpers/errorHandlers.js')

router.get('/', (req, res) => {
  res.send('Nest consultores')
})
router.get('/inicio', authUser, find)
router.get('/inicio/:role/:slug', authUser, findDashboard)
router.post('/crear-usuario', /*authUser*/ createUser)
router.post('/iniciar-sesion', autenticarUsuario)
router.put('/editar-perfil', checkFields, validatePassword, editProfile)
router.delete('/eliminar-cuenta/:email/:role/:toDelete', authUser, deleteUser)
router.get('/usuarios', getAllUsers)

module.exports = router
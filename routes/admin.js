const express = require ( 'express' )
const router = express.Router()

const  { createDashboard, panelAdmin } = require ( '../controllers/admin.js' )
const  { authUser } = require ( '../middlewares/auth.js')
// const  {validateCreateDashboard} = require ( '../validators/dashboard.js')

router.get('/administracion', authUser, panelAdmin)
router.post('/administracion/crear-dashboard', createDashboard)

module.exports = router
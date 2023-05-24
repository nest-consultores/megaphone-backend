
const { DataTypes } = require ('sequelize')
const db = require ('../config/db.js')

const Dashboard = db.define('dashboards', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false
  },
  requiredRole: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'gerente',
    validate: {
      isIn: {
        args: [['admin', 'encargado', 'gerente', 'supervisor', 'admin-encargado-gerente', 'admin-encargado-gerente-supervisor']],
        msg: "El valor de requiredRole debe ser unos de: 'supervisor', 'encargado', 'gerente', 'admin', 'supervisor-gerente', 'gerente-admin', 'supervisor-admin', 'supervisor-gerente-admin'."
      }
    }
  }

})


module.exports = Dashboard
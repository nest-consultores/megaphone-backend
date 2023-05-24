
const { DataTypes } = require ( 'sequelize')
const db = require('../config/db.js')
const bcrypt = require ( 'bcrypt-nodejs')

const User = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: { msg: 'Agrega un correo válido' }
    },
    unique: {
      args: true,
      msg: 'Usuario ya registrado'
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  active: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  role: {
    type: DataTypes.ENUM('admin', 'encargado', 'gerente', 'supervisor'),
    defaultValue: 'supervisor'
  },
  token: DataTypes.STRING,
  expireToken: DataTypes.DATE
}, {
  hooks: {
    beforeCreate(user) {
      user.password = User.prototype.hashPassword(user.password)
    }
  }
},)


//Método para comparar los password
User.prototype.validarPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}
User.prototype.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

module.exports = User
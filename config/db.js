// const Sequelize = require('sequelize')

// module.exports = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
//   host: process.env.PGHOST,
//   port: process.env.PGPORT,
//   dialect: 'postgres',
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
//   logging: false,
// })

const Sequelize = require('sequelize')

module.exports = new Sequelize('megaphone', 'postgres', 'nest-admin', {
  host: 'localhost',
  port: '5432',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
})
const { createLogger, transports, format } = require('winston')

const customerLogger = createLogger({
  transports: [
    new transports.File({
      filename: 'logger-info.log',
      level: 'info',
      format: format.combine(format.timestamp(), format.json())
    }),
    new transports.File({
      filename: 'logger-errors.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json())
    }),
  ]
})

module.exports = {customerLogger}
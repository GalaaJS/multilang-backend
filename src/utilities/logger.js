const winston = require('winston');
const { combine, timestamp, printf, errors } = winston.format;

const today = new Date();

const myFormat = printf(({ level, message, timestamp, stack }) => {
  if (stack) {
    return `${timestamp} [${level.toUpperCase()}] ${level}: ${message} ${stack}`;
  }
  return `${timestamp} [${level.toUpperCase()}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss.s' }), myFormat),
  transports: [
    new winston.transports.File({
      filename: `logs/${formatDate(today)}_error.log`,
      level: 'error',
    }),
    new winston.transports.File({
      filename: `logs/${formatDate(today)}_info.log`,
      level: 'info',
    }),
    new winston.transports.File({
      filename: `logs/${formatDate(today)}_warn.log`,
      level: 'warn',
    }),
    new winston.transports.File({
      filename: `logs/${formatDate(today)}_debug.log`,
      level: 'debug',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(
        winston.format.colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.s' }),
        myFormat
      ),
      level: 'debug',
    })
  );
}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

module.exports = logger;

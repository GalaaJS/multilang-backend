import { createLogger, format, transports } from 'winston';
import { Format } from 'logform';
import * as fs from 'fs';

const { combine, timestamp, printf, errors, colorize } = format;

const today = new Date();

const myFormat: Format = printf(({ level, message, timestamp, stack }) => {
  if (stack) {
    return `${timestamp} [${level.toUpperCase()}] ${level}: ${message} ${stack}`;
  }
  return `${timestamp} [${level.toUpperCase()}] ${level}: ${message}`;
});

const formatDate = (date: Date): string => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss.s' }), myFormat),
  transports: [
    new transports.File({
      filename: `logs/${formatDate(today)}_error.log`,
      level: 'error',
    }),
    new transports.File({
      filename: `logs/${formatDate(today)}_info.log`,
      level: 'info',
    }),
    new transports.File({
      filename: `logs/${formatDate(today)}_warn.log`,
      level: 'warn',
    }),
    new transports.File({
      filename: `logs/${formatDate(today)}_debug.log`,
      level: 'debug',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.s' }),
        myFormat
      ),
      level: 'debug',
    })
  );
}

export default logger;

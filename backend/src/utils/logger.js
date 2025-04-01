const { createLogger, format, transports } = require('winston');
// const DailyRotateFile = require('winston-daily-rotate-file');

const logger = createLogger(
  // {
  //   transports:
  //     new DailyRotateFile({
  //       filename: 'logs/server-%DATE%',
  //       datePattern: 'YYYY-MM-DD-HH',
  //       format: format.combine(
  //         format.timestamp({ format: 'MMM-DD-YYYY_HH-mm-ss' }),
  //         format.align(),
  //         format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
  //       ),
  //       zippedArchive: true,
  //       maxSize: '2M',
  //       maxFiles: '15d',
  //       extension: '.log'
  //     }
  //   )
  // }
);

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  logger.add(new transports.Console({
    format: format.combine(
      format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
      format.align(),
      format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    )
  }));
}
module.exports = logger;
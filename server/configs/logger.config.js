import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const { combine, timestamp, json, errors, colorize, simple } = winston.format;

const fileRotateTransport = new winston.transports.DailyRotateFile({
    dirname: path.join(process.cwd(), 'logs'),
    filename: 'app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    maxSize: '20m',
    zippedArchive: true,
});

const errorRotateTransport = new winston.transports.DailyRotateFile({
    dirname: path.join(process.cwd(), 'logs'),
    filename: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxFiles: '30d',
    zippedArchive: true,
});

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports: [fileRotateTransport, errorRotateTransport],
    exceptionHandlers: [
        new winston.transports.File({ filename: path.join(process.cwd(), 'logs', 'exceptions.log') }),
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: path.join(process.cwd(), 'logs', 'rejections.log') }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: combine(colorize(), simple()),
        }),
    );
}

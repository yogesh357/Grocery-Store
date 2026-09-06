import { Queue } from 'bullmq';
import redisClient from '../configs/redis';

const redisConnection = {
    host: 'localhost',
    port: 6379,
};

export const emailQueue = new Queue('email', {
    connection: redisClient,

    defaultJobOptions: {
        attempts: 3,

        backoff: {
            type: 'exponential',
            delay: 5000,
        },

        removeOnComplete: {
            age: 3600,
            count: 1000,
        },

        removeOnFail: {
            age: 86400,
        },
    },
});
// docker run -d --name redis -p 6379:6379 redis:7-alpine

// import { createClient } from 'redis';

// const client = createClient({
//     url: process.env.REDIS_URL,
// });

// client.on('error', (err) => {
//     console.error('Redis Client Error', err);
// });
// client.on('connection', (stream) => {
//     console.log('Connected to Redis !!', stream);
// });


// export default client;

import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error('REDIS_URL is not defined');
}

const redisClient = createClient({
    url: redisUrl,
});

redisClient.on('connect', () => {
    console.log('Redis connecting...');
});

redisClient.on('ready', () => {
    console.log('Redis connected and ready');
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});


export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

export const disconnectRedis = async () => {
    if (redisClient.isOpen) {
        await redisClient.quit();
    }
};

export default redisClient;

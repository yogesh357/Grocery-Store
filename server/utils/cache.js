import redisClient from '../configs/redis.js';

export const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);

        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Redis GET error [${key}]:`, error.message);
        return null;
    }
};

export const setCache = async (key, data, expiry = 300) => {
    try {
        await redisClient.set(key, JSON.stringify(data), {
            EX: expiry,
        });
    } catch (error) {
        console.error(`Redis SET error [${key}]:`, error.message);
    }
};

export const deleteCache = async (...keys) => {
    try {
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (error) {
        console.error('Redis DELETE error:', error.message);
    }
};
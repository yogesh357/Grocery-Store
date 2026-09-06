import Address from "../models/address.js";
import { setCache } from "../utils/cache.js";


// Add address : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { address } = req.body;
        const { id: userId } = req.user;

        await Address.create({ ...address, userId })
        res.json({ success: true, message: "Address added successfully" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}


// Get Address : /api/address/get

export const getAddress = async (req, res) => {
    try {

        const { id: userId } = req.user;

        const cacheKey = `address:${userId}`;

        const cachedAddresses = await getCache(cacheKey);

        if (cachedAddresses) {
            return res.json({
                success: true,
                addresses: cachedAddresses
            })
        }

        const addresses = await Address.find({ userId }).lean();

        setCache(cacheKey, addresses, 300);

        return res.json({
            success: true,
            addresses
        })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}
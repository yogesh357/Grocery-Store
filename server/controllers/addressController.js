import Address from "../models/address.js";


// Add address : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { address } = req.body; //========== also add adress, userId
        const { id: userId } = req.user;  //======================== we change req.body to req.user 
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
        // const { userId } = req.body;
        // const { userId } = req.user;
        const { id: userId } = req.user; // we are changi => userId = req.body to userId = req.user
        const addresses = await Address.find({ userId });
        res.json({ success: true, addresses })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}
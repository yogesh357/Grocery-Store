import User from "../models/user.js";


// Update Cart : /api/cart/update


export const updateCart = async (req, res) => {
    try {
        const {cartItems  } = req.body; 

        const { id: userId } = req.user;  


        await User.findByIdAndUpdate(userId, { cartItems })
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}
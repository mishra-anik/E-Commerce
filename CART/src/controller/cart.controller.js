const Cart = require('../model/cart.model');


const getCart = async (req, res) => {

    const userId = req.user.id;
    try{
        const cart = await Cart.findOne({ userId });
        if(!cart){

            const cart =  Cart.create({ userId, items: [] });
            await cart.save();

            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json({cart,totals:{
            totalItems: cart.items.length,
            totalQuantity: cart.items.reduce((acc, item) => acc + item.quantity, 0)   
        }});

    }catch(error){
        console.error("Error fetching cart", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const addCart  = async (req, res) => {
    const { productId, qty } = req.body;
    const userId = req.user.id;
    try{
        let cart = await Cart.findOne({ userId });
        if(!cart){
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndes(item => item.productId.toString() === productID);
        if(itemIndex){
            cart.items[itemIndex].quantity += qty;
    }else{
        cart.items.push({ productId: productID, quantity: qty });
    }
    await cart.save();
    res.status(200).json({ message: "Item added to cart successfully", cart });
}catch(error){
    console.error("Error adding item to cart", error);
    res.status(500).json({ message: "Internal server error" }); 
}
}

const updateCart = async (req, res) => {

    const { itemId } = req.params;
    const { qty } = req.body;
    const userId = req.user.id;
    try{
        const cart = await Cart.findOne({ userId });
       
        if(!cart){

            const cart =  Cart.create({ userId, items: [] });
            await cart.save();

            return res.status(404).json({ message: "Cart not found" });
        }
        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if(itemIndex === -1){
            return res.status(404).json({ message: "Item not found in cart" });
        }
        cart.items[itemIndex].quantity = qty;
        if(cart.items[itemIndex].quantity <= 0){
            cart.items.splice(itemIndex, 1);
        }
        await cart.save();
        res.status(200).json({ message: "Cart item updated successfully", cart });
    }catch(error){
        console.error("Error updating cart item", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

const removeItemFromCart = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.id;
    try{
        const cart = await Cart.findOne({ userId });
        if(!cart){
            cart = new Cart.create({ userId, items: [] });
            await cart.save();
            return res.status(404).json({ message: "Cart not found" });
        }
        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if(itemIndex === -1){
            return res.status(404).json({ message: "Item not found in cart" });
        }
        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.status(200).json({ message: "Item removed from cart successfully", cart });
    }catch(error){
        console.error("Error removing item from cart", error);
        res.status(500).json({ message: "Internal server error" });
}
}

const removeAllItemsFromCart = async (req, res) => {
    const userId = req.user.id;
    try{
        const cart = await Cart.findOne({ userId });
        if(!cart){
            cart = new Cart.create({ userId, items: [] });
            await cart.save();
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.items = [];
        await cart.save();
        res.status(200).json({ message: "All items removed from cart successfully", cart });
    }
    catch(error){
        console.error("Error removing all items from cart", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {getCart,addCart,updateCart , removeItemFromCart, removeAllItemsFromCart};
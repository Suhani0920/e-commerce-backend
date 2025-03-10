import Cart from "../models/cart.js";
import Product from "../models/product.js";
import calculateTotalPrice from "../middlewares/calculateTotalPrice.js";



// Add a product to the cart
const addToCart = async (req, res) => {
    const { user, product, quantity, totalPrice } = req.body;

    try {
        const existingCartItem = await Cart.findOne({ user, 'product._id': product._id });
        
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            existingCartItem.totalPrice += totalPrice;
            await existingCartItem.save();
            return res.status(200).json({ message: "Cart updated successfully", cart: existingCartItem });
        }

        const newCartItem = new Cart({
            user,
            product,
            quantity,
            totalPrice
        });

        await newCartItem.save();
        res.status(201).json({ message: "Product added to cart", cart: newCartItem });
    } catch (error) {
        res.status(500).json({ message: "Failed to add product to cart", error });
    }
};

// Remove an item from the cart
const removeFromCart = async (req, res) => {
    const { cartItemId } = req.params;

    try {
        const cartItem = await Cart.findByIdAndDelete(cartItemId);

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Cart item removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove cart item", error });
    }
};

// Get the cart for a specific user
const getUserCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cartItems = await Cart.find({ user: userId });

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve cart", error });
    }
};

export { addToCart, removeFromCart, getUserCart };



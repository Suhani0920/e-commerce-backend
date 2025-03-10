const calculateTotalPrice = (req, res, next) => {
    try {
        const { product, quantity } = req.body;

        if (!product || !quantity || !product.price) {
            return res.status(400).json({ message: 'Product or quantity missing.' });
        }

        
        req.body.totalPrice = product.price * quantity;
        
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Failed to calculate total price', error });
    }
};

export default calculateTotalPrice;
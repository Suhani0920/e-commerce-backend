import Review from "../models/review.js";
import Product from "../models/product.js";

 const addReview = async (req, res) => {
    const { productId, rating, comment } = req.body;

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the user has already reviewed the product
        const existingReview = await Review.findOne({ product: productId, user: req.user._id });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        // Create a new review
        const newReview = new Review({
            product: productId,
            user: req.user._id,
            rating,
            comment
        });

        await newReview.save();

        // Update product's rating
        const reviews = await Review.find({ product: productId });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        product.rating = totalRating / reviews.length;
        await product.save();

        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
};

// Controller to get all reviews of a product
 const getProductReviews = async (req, res) => {
    const { productId } = req.params;

    try {
        const reviews = await Review.find({ product: productId }).populate('user', 'name');
        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this product' });
        }
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// Controller to delete a review (Admin or User who wrote it)
 const deleteReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Only the admin or the user who created the review can delete it
        if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'You are not authorized to delete this review' });
        }

        await review.remove();

        // Update product's rating
        const reviews = await Review.find({ product: review.product });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const product = await Product.findById(review.product);
        product.rating = reviews.length ? totalRating / reviews.length : 0;
        await product.save();

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
};

// Controller to update a review (User who wrote it)
 const updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Only the user who created the review can update it
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this review' });
        }

        // Update the review
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        await review.save();

        // Update product's rating
        const reviews = await Review.find({ product: review.product });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const product = await Product.findById(review.product);
        product.rating = totalRating / reviews.length;
        await product.save();

        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
};

export{addReview,getProductReviews,deleteReview,updateReview,}
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { z } from 'zod';

const addToWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required')
});

/**
 * Add item to wishlist
 * POST /wishlist/add
 */
export const addToWishlist = async (req, res, next) => {
  try {
    const validatedData = addToWishlistSchema.parse(req.body);

    const product = await Product.findById(validatedData.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let wishlistItem = await Wishlist.findOne({
      userId: req.user.id,
      productId: validatedData.productId,
    });

    if (wishlistItem) {
      return res.status(200).json({ message: 'Item already in wishlist', wishlistItem });
    }

    wishlistItem = await Wishlist.create({
      userId: req.user.id,
      productId: validatedData.productId,
    });

    await wishlistItem.populate('productId');

    res.status(201).json({ wishlistItem });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's wishlist
 * GET /wishlist
 */
export const getWishlist = async (req, res, next) => {
  try {
    const wishlistItems = await Wishlist.find({ userId: req.user.id })
      .populate({
        path: 'productId',
      })
      .sort({ createdAt: -1 });

    res.json({ wishlistItems });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove item from wishlist
 * DELETE /wishlist/:itemId
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlistItem = await Wishlist.findById(req.params.itemId);

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    if (wishlistItem.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await wishlistItem.deleteOne();

    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

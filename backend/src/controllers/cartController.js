import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { addToCartSchema } from '../validators/index.js';

/**
 * Add item to cart
 * POST /cart/add
 */
export const addToCart = async (req, res, next) => {
  try {
    const validatedData = addToCartSchema.parse(req.body);

    // Check if product exists and has sufficient stock
    const product = await Product.findById(validatedData.productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < validatedData.quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Check if item already in cart
    let cartItem = await Cart.findOne({
      userId: req.user.id,
      productId: validatedData.productId,
    });

    if (cartItem) {
      // Update quantity
      cartItem.quantity += validatedData.quantity;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await Cart.create({
        userId: req.user.id,
        productId: validatedData.productId,
        quantity: validatedData.quantity,
      });
    }

    await cartItem.populate('productId', 'id title price imageUrl stock');

    res.status(201).json({ cartItem });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's cart
 * GET /cart
 */
export const getCart = async (req, res, next) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id })
      .populate({
        path: 'productId',
        select: 'id title price imageUrl stock',
        populate: {
          path: 'sellerId',
          select: 'id name',
        },
      })
      .sort({ createdAt: -1 });

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.productId?.price || 0) * item.quantity;
    }, 0);

    res.json({ cartItems, total });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove item from cart
 * DELETE /cart/:itemId
 */
export const removeFromCart = async (req, res, next) => {
  try {
    const cartItem = await Cart.findById(req.params.itemId);

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (cartItem.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await cartItem.deleteOne();

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

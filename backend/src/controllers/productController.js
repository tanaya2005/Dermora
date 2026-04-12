import Product from '../models/Product.js';
import ListingFee from '../models/ListingFee.js';
import { createProductSchema, updateProductSchema } from '../validators/index.js';

/**
 * Create new product (Seller only)
 * POST /products
 */
export const createProduct = async (req, res, next) => {
  try {
    const { listingFeeId, ...productData } = req.body;
    const validatedData = createProductSchema.parse(productData);

    // Verify listing fee payment
    if (!listingFeeId) {
      return res.status(400).json({ error: 'Listing fee payment required' });
    }

    const listingFee = await ListingFee.findById(listingFeeId);

    if (!listingFee) {
      return res.status(404).json({ error: 'Listing fee record not found' });
    }

    if (listingFee.sellerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (listingFee.status !== 'paid') {
      return res.status(400).json({ error: 'Listing fee not paid' });
    }

    if (listingFee.productId) {
      return res.status(400).json({ error: 'Listing fee already used for another product' });
    }

    // Create product
    const product = await Product.create({
      ...validatedData,
      sellerId: req.user.id,
    });

    // Link listing fee to product
    listingFee.productId = product._id;
    await listingFee.save();

    await product.populate('sellerId', '_id name email');

    res.status(201).json({ product });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(error);
  }
};

/**
 * Get all products with filters
 * GET /products
 */
export const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('sellerId', '_id name email')
        .select('title description price stock category imageUrl averageRating totalReviews status sellerId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);

    // Increment searchCount for all returned products if searching
    if (search && products.length > 0) {
      const productIds = products.map(p => p._id);
      await Product.updateMany(
        { _id: { $in: productIds } },
        { $inc: { searchCount: 1 } }
      );
    }

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single product by ID
 * GET /products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'id name email profileImage');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Increment clickCount
    product.clickCount = (product.clickCount || 0) + 1;
    await product.save();

    res.json({ product });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product (Seller can only update their own products)
 * PUT /products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const validatedData = updateProductSchema.parse(req.body);

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.sellerId.toString() !== req.user.id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    Object.assign(product, validatedData);
    await product.save();
    await product.populate('sellerId', 'id name');

    res.json({ product });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product (Seller can only delete their own products)
 * DELETE /products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.sellerId.toString() !== req.user.id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }

    await product.deleteOne();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update product stock directly
 * PATCH /products/admin/:id/stock
 */
export const updateProductStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    if (stock === undefined || isNaN(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({ error: 'Valid stock value required (>= 0)' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: Number(stock) },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
};


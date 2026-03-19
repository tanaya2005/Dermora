import Product from '../models/Product.js';
import { createProductSchema, updateProductSchema } from '../validators/index.js';

/**
 * Create new product (Seller only)
 * POST /products
 */
export const createProduct = async (req, res, next) => {
  try {
    const validatedData = createProductSchema.parse(req.body);

    const product = await Product.create({
      ...validatedData,
      sellerId: req.user.id,
    });

    await product.populate('sellerId', 'id name email');

    res.status(201).json({ product });
  } catch (error) {
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
        .skip(skip)
        .limit(parseInt(limit))
        .populate('sellerId', 'id name')
        .sort({ createdAt: -1 }),
      Product.countDocuments(query),
    ]);

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

    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
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

    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }

    await product.deleteOne();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

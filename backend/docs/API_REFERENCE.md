# API Reference

Complete API documentation for Dermora Backend.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require authentication. Include JWT token in headers:

```
Authorization: Bearer <your-token>
```

## Response Format

### Success Response

```json
{
  "user": { ... },
  "token": "..."
}
```

### Error Response

```json
{
  "error": "Error message",
  "details": { ... }
}
```

## Endpoints

### Authentication

#### POST /auth/signup

Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "BUYER"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "BUYER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login

Login existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": { ... },
  "token": "..."
}
```

#### GET /auth/me

Get current authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "BUYER"
  }
}
```

---

### Products

#### POST /products

Create a new product (Seller only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Vitamin C Serum",
  "description": "Brightening serum with 20% Vitamin C",
  "price": 2999,
  "stock": 50,
  "category": "Serums",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:** `201 Created`

#### GET /products

Get all products with optional filters.

**Query Parameters:**
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search in title/description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Example:**
```
GET /products?category=Serums&minPrice=1000&maxPrice=5000&page=1
```

**Response:** `200 OK`
```json
{
  "products": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

#### GET /products/:id

Get single product by ID.

**Response:** `200 OK`

#### PUT /products/:id

Update product (Seller can only update their own).

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "price": 3499
}
```

**Response:** `200 OK`

#### DELETE /products/:id

Delete product (Seller can only delete their own).

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Cart

#### POST /cart/add

Add item to cart.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "clx...",
  "quantity": 2
}
```

**Response:** `201 Created`

#### GET /cart

Get user's cart.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "cartItems": [ ... ],
  "total": 5998
}
```

#### DELETE /cart/:itemId

Remove item from cart.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Orders

#### POST /orders/create

Create a new order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "items": [
    {
      "productId": "clx...",
      "quantity": 2
    }
  ]
}
```

**Response:** `201 Created`

#### GET /orders/user

Get current user's orders.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

#### GET /orders/seller

Get seller's orders (Seller only).

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

#### GET /orders/admin

Get all orders (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Payments

#### POST /payments/create-order

Create Razorpay order for payment.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "orderId": "clx..."
}
```

**Response:** `200 OK`
```json
{
  "orderId": "order_xxxxxxxxxxxxx",
  "amount": 299900,
  "currency": "INR",
  "keyId": "rzp_test_xxxxxxxxxxxxx"
}
```

#### POST /payments/verify

Verify payment after Razorpay checkout.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxxxxxxxxxxxx",
  "razorpay_payment_id": "pay_xxxxxxxxxxxxx",
  "razorpay_signature": "signature_string",
  "orderId": "clx..."
}
```

**Response:** `200 OK`

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting. Consider implementing for production.

## Pagination

List endpoints support pagination:
- Default: 20 items per page
- Max: 100 items per page

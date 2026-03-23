// Use relative URLs to leverage Vite proxy in development
const API_URL = import.meta.env.PROD ? (import.meta.env.VITE_API_URL || "http://localhost:5000") : "";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include", // Important: sends cookies for Better Auth
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Product API
export async function getProducts(params?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    });
  }
  
  return apiRequest(`/api/products?${query.toString()}`);
}

export async function getProduct(id: string) {
  return apiRequest(`/api/products/${id}`);
}

export async function createProduct(data: {
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}) {
  return apiRequest("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: string, data: Partial<{
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}>) {
  return apiRequest(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string) {
  return apiRequest(`/api/products/${id}`, {
    method: "DELETE",
  });
}

// Cart API
export async function addToCart(productId: string, quantity: number = 1) {
  return apiRequest("/api/cart/add", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function getCart() {
  return apiRequest("/api/cart");
}

export async function removeFromCart(itemId: string) {
  return apiRequest(`/api/cart/${itemId}`, {
    method: "DELETE",
  });
}

// Order API
export async function createOrder(items: Array<{ productId: string; quantity: number }>) {
  return apiRequest("/api/orders/create", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

export async function getUserOrders() {
  return apiRequest("/api/orders/user");
}

export async function getSellerOrders() {
  return apiRequest("/api/orders/seller");
}

export async function getAllOrders() {
  return apiRequest("/api/orders/admin");
}

// Payment API
export async function createPaymentOrder(orderId: string) {
  return apiRequest("/api/payments/create-order", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
}

export async function verifyPayment(paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}) {
  return apiRequest("/api/payments/verify", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
}
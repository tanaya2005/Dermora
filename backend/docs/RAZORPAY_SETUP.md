# Razorpay Payment Integration Guide

This guide explains how to set up Razorpay for payment processing in Dermora.

## What is Razorpay?

Razorpay is a payment gateway that allows you to accept payments via:
- Credit/Debit Cards
- Net Banking
- UPI
- Wallets
- EMI

## Step-by-Step Setup

### 1. Create Razorpay Account

1. Visit [https://razorpay.com](https://razorpay.com)
2. Click "Sign Up" and create an account
3. Complete the registration process
4. Verify your email address

### 2. Access Dashboard

1. Log in to [https://dashboard.razorpay.com](https://dashboard.razorpay.com)
2. You'll see two modes:
   - **Test Mode**: For development and testing
   - **Live Mode**: For production

### 3. Get API Keys (Test Mode)

For development, use Test Mode keys:

1. In the dashboard, ensure "Test Mode" is selected (toggle in top-left)
2. Go to **Settings** → **API Keys**
3. Click "Generate Test Keys" if not already generated
4. You'll see:
   - **Key ID**: Starts with `rzp_test_`
   - **Key Secret**: Click "Show" to reveal

**Important**: Copy both keys immediately.

### 4. Configure Environment Variables

Add your Razorpay keys to `.env`:

```env
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_secret_key_here"
```

### 5. Test Mode Credentials

For testing payments in Test Mode, use these test cards:

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**
- Card Number: `4111 1111 1111 1112`

## Payment Flow

### Backend Flow

1. **Create Order** (`POST /api/payments/create-order`)
   - Buyer initiates checkout
   - Backend creates Razorpay order
   - Returns order ID and amount to frontend

2. **Process Payment** (Frontend)
   - Frontend opens Razorpay checkout
   - User completes payment
   - Razorpay returns payment details

3. **Verify Payment** (`POST /api/payments/verify`)
   - Frontend sends payment details to backend
   - Backend verifies signature
   - Updates order status
   - Reduces product stock

### API Endpoints

#### Create Payment Order

**POST** `/api/payments/create-order`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "orderId": "clx..."
}
```

**Response:**
```json
{
  "orderId": "order_xxxxxxxxxxxxx",
  "amount": 299900,
  "currency": "INR",
  "keyId": "rzp_test_xxxxxxxxxxxxx"
}
```

#### Verify Payment

**POST** `/api/payments/verify`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "razorpay_order_id": "order_xxxxxxxxxxxxx",
  "razorpay_payment_id": "pay_xxxxxxxxxxxxx",
  "razorpay_signature": "signature_string",
  "orderId": "clx..."
}
```

**Response:**
```json
{
  "message": "Payment verified successfully",
  "order": { ... }
}
```

## Frontend Integration

### Install Razorpay Checkout

Add to your HTML:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Payment Implementation

```javascript
// 1. Create order on backend
const createOrder = async (cartItems) => {
  const response = await fetch('/api/orders/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ items: cartItems })
  });
  
  const { order } = await response.json();
  return order;
};

// 2. Create payment order
const createPaymentOrder = async (orderId) => {
  const response = await fetch('/api/payments/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ orderId })
  });
  
  return await response.json();
};

// 3. Open Razorpay checkout
const processPayment = async (paymentOrder, order) => {
  const options = {
    key: paymentOrder.keyId,
    amount: paymentOrder.amount,
    currency: paymentOrder.currency,
    order_id: paymentOrder.orderId,
    name: 'Dermora',
    description: 'Skincare Products',
    handler: async (response) => {
      // Payment successful, verify on backend
      await verifyPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        orderId: order.id
      });
    },
    prefill: {
      name: user.name,
      email: user.email
    },
    theme: {
      color: '#3399cc'
    }
  };
  
  const razorpay = new Razorpay(options);
  razorpay.open();
};

// 4. Verify payment
const verifyPayment = async (paymentData) => {
  const response = await fetch('/api/payments/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(paymentData)
  });
  
  if (response.ok) {
    // Payment verified, redirect to success page
    window.location.href = '/order-success';
  }
};
```

## Going Live (Production)

### 1. Complete KYC

Before going live, you must complete KYC:

1. Go to **Settings** → **Account & Settings**
2. Complete business verification
3. Submit required documents:
   - Business PAN
   - Business proof
   - Bank account details

### 2. Get Live API Keys

1. Switch to "Live Mode" in dashboard
2. Go to **Settings** → **API Keys**
3. Generate Live Keys
4. Update your production `.env`:

```env
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_live_secret_key"
```

### 3. Configure Webhooks (Optional)

For better reliability, set up webhooks:

1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Save webhook secret in `.env`

## Security Best Practices

1. **Never expose Key Secret**: Keep it server-side only
2. **Always verify signatures**: Don't trust frontend data
3. **Use HTTPS**: Required for production
4. **Validate amounts**: Check amount matches order total
5. **Handle failures**: Implement proper error handling

## Testing Checklist

- [ ] Successful payment flow
- [ ] Failed payment handling
- [ ] Order status updates correctly
- [ ] Stock reduces after payment
- [ ] Cart clears after successful payment
- [ ] Payment signature verification works
- [ ] Error messages display properly

## Troubleshooting

### "Key ID is invalid"

- Check if you're using correct mode (test/live)
- Verify key is copied correctly
- Ensure no extra spaces in `.env`

### "Signature verification failed"

- Check Key Secret is correct
- Ensure signature calculation matches Razorpay's format
- Verify order_id and payment_id are correct

### Payment succeeds but order not updated

- Check webhook configuration
- Verify `/api/payments/verify` endpoint is working
- Check server logs for errors

## Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)

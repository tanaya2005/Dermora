import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <span className="text-primary font-medium">Terms of Service</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using Dermora ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Dermora is an online skincare marketplace platform that connects customers with skincare products and dermatologist consultations. 
              Our services include:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Online skincare product marketplace</li>
              <li>Skin assessment and personalized recommendations</li>
              <li>Dermatologist consultation services</li>
              <li>Subscription-based product delivery</li>
              <li>Customer reviews and feedback system</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Product Information and Orders</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to provide accurate product information, but we do not warrant that product descriptions or other content is accurate, complete, reliable, or error-free.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Acceptance</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>All orders are subject to acceptance and availability</li>
              <li>We reserve the right to refuse or cancel orders</li>
              <li>Prices are subject to change without notice</li>
              <li>We are not responsible for typographical errors in pricing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment and Billing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Payment is required at the time of purchase. We accept various payment methods as displayed during checkout.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>All payments are processed securely through third-party payment processors</li>
              <li>You authorize us to charge your payment method for all purchases</li>
              <li>Subscription services will be charged automatically on the billing cycle</li>
              <li>Refunds are subject to our return policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Shipping and Returns</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We aim to process and ship orders promptly. Shipping times may vary based on location and product availability.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Return Policy</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Products may be returned within 30 days of delivery</li>
              <li>Items must be unused and in original packaging</li>
              <li>Personalized or custom products are not returnable</li>
              <li>Return shipping costs may apply</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. User Content and Reviews</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Users may submit reviews, comments, and other content. By submitting content, you grant us a non-exclusive, royalty-free license to use, modify, and display such content.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Content must be truthful and based on personal experience</li>
              <li>Prohibited content includes offensive, defamatory, or inappropriate material</li>
              <li>We reserve the right to remove or modify user content</li>
              <li>Users are responsible for the content they submit</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Medical Disclaimers</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Important:</strong> The information provided on Dermora is for educational purposes only and is not intended as medical advice.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Consult with a healthcare professional before using new skincare products</li>
              <li>Dermatologist consultations are for informational purposes</li>
              <li>We are not responsible for adverse reactions to products</li>
              <li>Individual results may vary</li>
              <li>Discontinue use if irritation occurs</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content on Dermora, including text, graphics, logos, and software, is protected by intellectual property rights.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Users may not reproduce, distribute, or modify our content without permission</li>
              <li>Product images and descriptions are owned by respective sellers or Dermora</li>
              <li>Trademarks and brand names are property of their respective owners</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>We collect information necessary to provide our services</li>
              <li>Personal data is protected according to applicable privacy laws</li>
              <li>We do not sell personal information to third parties</li>
              <li>Users can request access to or deletion of their data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the fullest extent permitted by law, Dermora shall not be liable for any indirect, incidental, special, or consequential damages.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Our liability is limited to the amount paid for the specific product or service</li>
              <li>We are not responsible for third-party content or services</li>
              <li>Users assume risk when using skincare products</li>
              <li>Service interruptions may occur without liability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may terminate or suspend your account and access to the Service at our discretion, with or without notice.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Violations of these terms may result in account termination</li>
              <li>Users may close their accounts at any time</li>
              <li>Certain provisions survive termination</li>
              <li>Outstanding orders and subscriptions remain valid until fulfilled</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Users will be notified of significant changes</li>
              <li>Continued use constitutes acceptance of modified terms</li>
              <li>Users may discontinue use if they disagree with changes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@dermora.com</p>
              <p className="text-gray-700 mb-2"><strong>Address:</strong> Dermora Skincare, 123 Beauty Lane, Skincare City, SC 12345</p>
              <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </section>

          <div className="border-t pt-8 mt-8">
            <p className="text-sm text-gray-500">
              By using Dermora, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
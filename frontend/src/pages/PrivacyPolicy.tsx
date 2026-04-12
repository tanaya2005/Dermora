import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <span className="text-primary font-medium">Privacy Policy</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Dermora ("we," "our," or "us"), we are committed to protecting your privacy and personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, 
              mobile application, and services (collectively, the "Service").
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              By using our Service, you consent to the data practices described in this policy. If you do not agree with 
              the practices described in this policy, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect personal information that you voluntarily provide to us, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Name, email address, and contact information</li>
              <li>Account credentials (username and password)</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information (processed securely by third-party providers)</li>
              <li>Profile information and preferences</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 Skin Assessment Data</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you complete our skin assessment, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Skin type and condition information</li>
              <li>Skincare concerns and goals</li>
              <li>Product preferences and allergies</li>
              <li>Lifestyle factors affecting skin health</li>
              <li>Photos (if voluntarily provided)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">2.3 Usage and Technical Data</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We automatically collect certain information when you use our Service:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage patterns and navigation behavior</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Location data (if permitted)</li>
              <li>Log files and analytics data</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">2.4 User-Generated Content</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Product reviews and ratings</li>
              <li>Comments and feedback</li>
              <li>Photos and testimonials</li>
              <li>Community forum posts</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the collected information for various purposes:
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Service Provision</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Create and manage your account</li>
              <li>Process orders and payments</li>
              <li>Provide personalized product recommendations</li>
              <li>Facilitate dermatologist consultations</li>
              <li>Deliver customer support</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Communication</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Send order confirmations and shipping updates</li>
              <li>Provide customer service responses</li>
              <li>Send marketing communications (with consent)</li>
              <li>Notify about product updates and promotions</li>
              <li>Share skincare tips and educational content</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">3.3 Improvement and Analytics</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Analyze usage patterns to improve our Service</li>
              <li>Conduct research and development</li>
              <li>Personalize user experience</li>
              <li>Monitor and prevent fraud</li>
              <li>Ensure security and compliance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 Service Providers</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Payment processors for transaction handling</li>
              <li>Shipping companies for order delivery</li>
              <li>Cloud storage and hosting providers</li>
              <li>Analytics and marketing service providers</li>
              <li>Customer support platforms</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 Healthcare Professionals</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Dermatologists for consultation services (with your consent)</li>
              <li>Healthcare providers for treatment recommendations</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">4.3 Legal Requirements</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Compliance with legal obligations</li>
              <li>Response to lawful requests from authorities</li>
              <li>Protection of our rights and safety</li>
              <li>Prevention of fraud and abuse</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">4.4 Business Transfers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure payment processing through certified providers</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              However, no method of transmission over the internet or electronic storage is 100% secure. 
              While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">6.1 Types of Cookies</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
              <li><strong>Performance Cookies:</strong> Help us understand how you use our site</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">6.2 Cookie Management</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can control cookies through your browser settings. However, disabling certain cookies may affect site functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Privacy Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">7.1 Access and Portability</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Request access to your personal information</li>
              <li>Receive a copy of your data in a portable format</li>
              <li>Understand how your information is processed</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">7.2 Correction and Updates</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Correct inaccurate or incomplete information</li>
              <li>Update your account and profile information</li>
              <li>Modify communication preferences</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">7.3 Deletion and Restriction</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Request deletion of your personal information</li>
              <li>Restrict processing of your data</li>
              <li>Object to certain types of processing</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">7.4 Marketing Communications</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Opt-out of marketing emails at any time</li>
              <li>Unsubscribe from promotional communications</li>
              <li>Manage notification preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Provide our services and maintain your account</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Improve our services and conduct analytics</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              When information is no longer needed, we securely delete or anonymize it according to our data retention policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your information during international transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. 
              If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices 
              of these third parties. We encourage you to review their privacy policies before providing any information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Posting the updated policy on our website</li>
              <li>Sending email notifications to registered users</li>
              <li>Displaying prominent notices on our Service</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your continued use of our Service after changes become effective constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Privacy Officer</h3>
              <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@dermora.com</p>
              <p className="text-gray-700 mb-2"><strong>Address:</strong> Dermora Skincare, Privacy Department</p>
              <p className="text-gray-700 mb-2">123 Beauty Lane, Skincare City, SC 12345</p>
              <p className="text-gray-700 mb-4"><strong>Phone:</strong> +1 (555) 123-4567</p>
              
              <h4 className="text-md font-semibold text-gray-900 mb-2">Data Protection Rights Requests</h4>
              <p className="text-gray-700 mb-2">
                To exercise your privacy rights, please use our dedicated form at: 
                <a href="/privacy-request" className="text-primary hover:underline ml-1">dermora.com/privacy-request</a>
              </p>
              <p className="text-gray-700 text-sm">
                We will respond to your request within 30 days as required by applicable law.
              </p>
            </div>
          </section>

          <div className="border-t pt-8 mt-8">
            <p className="text-sm text-gray-500">
              By using Dermora, you acknowledge that you have read, understood, and agree to the collection and use of 
              your information as described in this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
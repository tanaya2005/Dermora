import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyRequest() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requestType: '',
    description: '',
    verificationMethod: 'email'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted Successfully</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your privacy request. We have received your submission and will process it within 30 days as required by law.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You will receive a confirmation email shortly with a reference number for tracking your request.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <span>›</span>
          <span className="text-primary font-medium">Privacy Request</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Rights Request</h1>
          <p className="text-gray-600">
            Use this form to exercise your privacy rights regarding your personal information. 
            We will respond to your request within 30 days.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Request Type */}
            <div>
              <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-2">
                Type of Request *
              </label>
              <select
                id="requestType"
                name="requestType"
                required
                value={formData.requestType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a request type</option>
                <option value="access">Access to Personal Information</option>
                <option value="correction">Correction of Personal Information</option>
                <option value="deletion">Deletion of Personal Information</option>
                <option value="portability">Data Portability</option>
                <option value="restriction">Restriction of Processing</option>
                <option value="objection">Objection to Processing</option>
                <option value="opt-out">Opt-out of Marketing</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Request Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Please provide details about your request..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Verification Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Verification Method *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="verificationMethod"
                    value="email"
                    checked={formData.verificationMethod === 'email'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Email verification</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="verificationMethod"
                    value="phone"
                    checked={formData.verificationMethod === 'phone'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Phone verification</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="verificationMethod"
                    value="document"
                    checked={formData.verificationMethod === 'document'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Document verification (ID required)</span>
                </label>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Important Information</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• We may need to verify your identity before processing your request</li>
                <li>• Response time is typically within 30 days</li>
                <li>• Some requests may require additional documentation</li>
                <li>• You will receive email updates on the status of your request</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have questions about your privacy rights or need assistance with this form, please contact our Privacy Officer:
          </p>
          <div className="text-sm text-gray-600">
            <p><strong>Email:</strong> privacy@dermora.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}
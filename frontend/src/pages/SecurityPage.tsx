import React from 'react';
import { motion } from 'framer-motion';

const SecurityPage: React.FC = () => {
  const securityFeatures = [
    {
      icon: '🔐',
      title: 'Password Hashing',
      description: 'All user passwords are encrypted using bcrypt with salt rounds for maximum security.',
      technical: 'We use bcrypt with 12 salt rounds and never store plain text passwords in our database.',
      status: 'Active'
    },
    {
      icon: '🔒',
      title: 'HTTPS/TLS Encryption',
      description: 'All data transmission is encrypted using industry-standard TLS 1.3 protocol.',
      technical: 'End-to-end encryption with 256-bit SSL certificates and HSTS headers for secure communication.',
      status: 'Active'
    },
    {
      icon: '🛡️',
      title: 'Session Security',
      description: 'Secure session management with httpOnly cookies and CSRF protection.',
      technical: 'JWT tokens with short expiration times, secure cookie flags, and automatic session invalidation.',
      status: 'Active'
    },
    {
      icon: '✅',
      title: 'Input Validation',
      description: 'All user inputs are validated and sanitized to prevent injection attacks.',
      technical: 'Server-side validation using Zod schemas, SQL injection prevention, and XSS protection.',
      status: 'Active'
    },
    {
      icon: '⚡',
      title: 'Rate Limiting',
      description: 'API rate limiting prevents abuse and ensures service availability.',
      technical: 'Configurable rate limits per endpoint with Redis-based tracking and automatic IP blocking.',
      status: 'Active'
    },
    {
      icon: '💳',
      title: 'Payment Security',
      description: 'PCI DSS compliant payment processing with tokenization.',
      technical: 'Razorpay integration with tokenized payments, no card data storage, and fraud detection.',
      status: 'Active'
    },
    {
      icon: '🔍',
      title: 'Data Privacy',
      description: 'GDPR compliant data handling with user consent and data portability.',
      technical: 'Data minimization, purpose limitation, user consent tracking, and right to deletion.',
      status: 'Active'
    },
    {
      icon: '📊',
      title: 'Security Monitoring',
      description: 'Real-time monitoring and alerting for security incidents.',
      technical: 'Automated threat detection, security logs, intrusion detection, and incident response.',
      status: 'Active'
    }
  ];

  return (
    <div className="min-h-screen bg-secondary dark:bg-primary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-secondary py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-display font-bold mb-6">
              Security & Privacy
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Your security and privacy are our top priorities. Learn about the comprehensive 
              measures we take to protect your personal information and ensure safe transactions.
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔒</span>
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🛡️</span>
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">💳</span>
                <span>PCI DSS Certified</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold text-primary dark:text-secondary mb-6">
              Our Security Measures
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Comprehensive protection at every level of our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-card p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl flex-shrink-0">{feature.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-primary dark:text-secondary">
                        {feature.title}
                      </h3>
                      <span className="bg-success/20 text-success px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <span>✅</span>
                        <span>{feature.status}</span>
                      </span>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {feature.description}
                    </p>
                    
                    <div className="bg-secondary/30 dark:bg-slate-800 p-4 rounded-xl">
                      <h4 className="font-semibold text-sm text-primary dark:text-secondary mb-2">
                        Technical Implementation:
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {feature.technical}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance & Certifications */}
      <section className="py-20 px-6 bg-secondary/30 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold text-primary dark:text-secondary mb-6">
              Compliance & Certifications
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              We adhere to international security standards and regulations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="glass-card p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-6xl mb-4">🇪🇺</div>
              <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-3">
                GDPR Compliance
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Full compliance with European General Data Protection Regulation
              </p>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Right to access your data</li>
                <li>• Right to data portability</li>
                <li>• Right to deletion</li>
                <li>• Consent management</li>
              </ul>
            </motion.div>

            <motion.div
              className="glass-card p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-3">
                PCI DSS Level 1
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Payment Card Industry Data Security Standard compliance
              </p>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Secure payment processing</li>
                <li>• Card data tokenization</li>
                <li>• Network security</li>
                <li>• Regular security testing</li>
              </ul>
            </motion.div>

            <motion.div
              className="glass-card p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-3">
                ISO 27001
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Information Security Management System certification
              </p>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Risk management</li>
                <li>• Security policies</li>
                <li>• Incident response</li>
                <li>• Continuous monitoring</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold text-primary dark:text-secondary mb-6">
              How We Protect Your Data
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">
                Data Collection & Usage
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary dark:text-secondary">Minimal Data Collection</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      We only collect data necessary for providing our services
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary dark:text-secondary">Purpose Limitation</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Data is used only for the specific purposes you consented to
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary dark:text-secondary">Data Retention</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Personal data is deleted when no longer needed
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary dark:text-secondary">No Third-Party Sharing</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      We never sell or share your personal data with third parties
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">
                Your Rights & Controls
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">👤</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary dark:text-secondary">Access Your Data</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Request a copy of all personal data we have about you
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✏️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary dark:text-secondary">Correct Information</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Update or correct any inaccurate personal information
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">🗑️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary dark:text-secondary">Delete Your Account</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">📤</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary dark:text-secondary">Export Your Data</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Download your data in a portable format
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Security Team */}
      <section className="py-20 px-6 bg-gradient-to-r from-accent to-accent-light text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold mb-6">
              Security Questions or Concerns?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Our security team is here to help. Report vulnerabilities or ask questions about our security practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:security@dermora.com"
                className="bg-white text-accent px-8 py-3 rounded-xl font-semibold hover:bg-secondary transition-colors"
              >
                Contact Security Team
              </a>
              <a 
                href="mailto:privacy@dermora.com"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-accent transition-colors"
              >
                Privacy Questions
              </a>
            </div>
            <p className="text-sm opacity-80 mt-6">
              For security vulnerabilities, please use our responsible disclosure process
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SecurityPage;
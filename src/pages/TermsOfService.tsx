import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-6 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6 text-primary hover:text-primary/80"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="prose prose-lg max-w-none bg-white rounded-xl shadow-lg p-8 sm:p-12"
          >
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  By accessing and using EventHub ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  EventHub is a calendar synchronization service that allows users to view events from multiple calendar providers (Google Calendar and Microsoft Outlook) in a unified interface.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  EventHub provides the following services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Calendar synchronization between Google Calendar and Microsoft Outlook</li>
                  <li>Unified event viewing and management interface</li>
                  <li>Real-time event updates and notifications</li>
                  <li>Search and filtering capabilities across multiple calendars</li>
                  <li>Secure authentication through OAuth 2.0 protocols</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts and Authentication</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  To use EventHub, you must:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Grant necessary permissions to access your calendar data</li>
                  <li>Comply with the terms of service of connected calendar providers</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Permitted Use</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  You may use EventHub for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal calendar management and organization</li>
                  <li>Viewing and managing events from connected calendar accounts</li>
                  <li>Synchronizing calendar data across multiple platforms</li>
                  <li>Searching and filtering calendar events</li>
                  <li>Any lawful purpose consistent with these terms</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Use</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  You may not use EventHub to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Access or attempt to access other users' calendar data without permission</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Use automated systems to access the Service without authorization</li>
                  <li>Reverse engineer, decompile, or disassemble the Service</li>
                  <li>Share your account credentials with others</li>
                  <li>Use the Service for commercial purposes without permission</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data and Privacy</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We only access calendar data necessary to provide our services</li>
                  <li>Your data is encrypted and stored securely</li>
                  <li>We do not sell or share your personal information with third parties</li>
                  <li>You can disconnect your calendar accounts at any time</li>
                  <li>You can request deletion of your account and associated data</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Services</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  EventHub integrates with third-party services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google Calendar API:</strong> Subject to Google's Terms of Service</li>
                  <li><strong>Microsoft Graph API:</strong> Subject to Microsoft's Terms of Use</li>
                  <li><strong>Firebase Services:</strong> Subject to Google's Firebase Terms of Service</li>
                </ul>
                <p>
                  Your use of these third-party services is subject to their respective terms and conditions.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Service Availability</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We strive to provide reliable service, but we cannot guarantee:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Uninterrupted access to the Service</li>
                  <li>Error-free operation at all times</li>
                  <li>Compatibility with all devices or browsers</li>
                  <li>Real-time synchronization in all circumstances</li>
                </ul>
                <p>
                  We reserve the right to modify, suspend, or discontinue the Service at any time.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  EventHub and its original content, features, and functionality are owned by the developer and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  You retain ownership of your calendar data and content. By using our service, you grant us a limited license to access and display your calendar data solely for the purpose of providing our services.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  To the maximum extent permitted by law, EventHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                </p>
                <p>
                  Our total liability to you for any claim arising out of or relating to these terms or the Service shall not exceed the amount you paid us, if any, for the Service in the 12 months preceding the claim.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Indemnification</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  You agree to defend, indemnify, and hold harmless EventHub and its developer from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including attorney's fees) arising from your use of the Service or violation of these Terms.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p>
                  You may terminate your account at any time by disconnecting your calendar accounts and requesting account deletion.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p>
                  Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions.
                </p>
                <p>
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p><strong>Email:</strong> <a href="mailto:chimdumebinebolisa@gmail.com" className="text-primary hover:underline">chimdumebinebolisa@gmail.com</a></p>
                  <p><strong>Developer:</strong> Chimdumebi Nebolisa</p>
                  <p><strong>Website:</strong> <a href="https://event-hub-38053.web.app" className="text-primary hover:underline">event-hub-38053.web.app</a></p>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;

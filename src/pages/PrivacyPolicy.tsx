import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
              Privacy Policy
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  EventHub collects the following information to provide our calendar synchronization services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Authentication Information:</strong> Email addresses and basic profile information from Google and Microsoft accounts</li>
                  <li><strong>Calendar Data:</strong> Event titles, descriptions, dates, times, locations, and attendee information from connected calendars</li>
                  <li><strong>Usage Data:</strong> How you interact with our application to improve user experience</li>
                  <li><strong>Technical Data:</strong> Browser type, device information, and IP address for security purposes</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>We use your information solely to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide calendar synchronization and unified event viewing services</li>
                  <li>Authenticate your access to Google Calendar and Microsoft Outlook</li>
                  <li>Display your events in a unified dashboard format</li>
                  <li>Improve our application performance and user experience</li>
                  <li>Ensure the security and integrity of our service</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Storage and Security</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Your data is protected using industry-standard security measures:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All data transmission is encrypted using HTTPS/TLS protocols</li>
                  <li>Authentication tokens are securely stored and regularly refreshed</li>
                  <li>Calendar data is cached temporarily and not permanently stored on our servers</li>
                  <li>We use Firebase Authentication and Google Cloud security infrastructure</li>
                  <li>Access to your data is limited to necessary operations only</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Services</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  EventHub integrates with the following third-party services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google Calendar API:</strong> To access and display your Google Calendar events</li>
                  <li><strong>Microsoft Graph API:</strong> To access and display your Outlook calendar events</li>
                  <li><strong>Firebase:</strong> For authentication, hosting, and data storage services</li>
                  <li><strong>Google Analytics:</strong> For usage analytics and performance monitoring</li>
                </ul>
                <p>
                  These services have their own privacy policies, and we encourage you to review them.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights and Choices</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>You have the following rights regarding your data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> View the data we have collected about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                  <li><strong>Portability:</strong> Export your data in a standard format</li>
                  <li><strong>Withdrawal:</strong> Disconnect your calendar accounts at any time</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We retain your data only as long as necessary to provide our services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information is retained until you delete your account</li>
                  <li>Calendar data is cached temporarily and refreshed regularly</li>
                  <li>Authentication tokens are stored until you disconnect your accounts</li>
                  <li>Usage analytics are anonymized and retained for service improvement</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Local Storage</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  EventHub uses cookies and local storage for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintaining your login session</li>
                  <li>Storing your preferences and settings</li>
                  <li>Remembering your connected calendar accounts</li>
                  <li>Improving application performance</li>
                </ul>
                <p>
                  You can control cookie settings through your browser preferences.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Posting the updated policy on this page</li>
                  <li>Updating the "Last updated" date</li>
                  <li>Sending you an email notification for significant changes</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p><strong>Email:</strong> <a href="mailto:chimdumebinebolisa@gmail.com" className="text-primary hover:underline">chimdumebinebolisa@gmail.com</a></p>
                  <p><strong>Developer:</strong> Chimdumebi Nebolisa</p>
                  <p><strong>Website:</strong> <a href="https://eventhub.buzz" className="text-primary hover:underline">eventhub.buzz</a></p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Compliance</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  This Privacy Policy complies with applicable data protection laws, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>General Data Protection Regulation (GDPR)</li>
                  <li>California Consumer Privacy Act (CCPA)</li>
                  <li>Google API Services User Data Policy</li>
                  <li>Microsoft API Terms of Use</li>
                </ul>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

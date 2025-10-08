import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsAccepted(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 1000);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  const handleViewPrivacyPolicy = () => {
    navigate('/privacy-policy');
  };

  const handleViewTerms = () => {
    navigate('/terms-of-service');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      >
        <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8">
            {!isAccepted ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Cookie className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        Cookie Consent & Terms Agreement
                      </h3>
                      <p className="text-sm text-gray-600">
                        We use cookies to enhance your experience
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDecline}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    By using EventHub, you agree to our use of cookies and our Terms of Service. 
                    We use cookies to:
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Secure Authentication</p>
                        <p className="text-sm text-gray-600">Keep you logged in securely</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Cookie className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Remember Preferences</p>
                        <p className="text-sm text-gray-600">Save your settings and preferences</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Calendar Access</p>
                        <p className="text-sm text-gray-600">Connect to your Google & Outlook calendars</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Cookie className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Performance</p>
                        <p className="text-sm text-gray-600">Improve app speed and reliability</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Important:</strong> By clicking "Accept & Continue", you agree to our{' '}
                      <button 
                        onClick={handleViewTerms}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Terms of Service
                      </button>
                      {' '}and{' '}
                      <button 
                        onClick={handleViewPrivacyPolicy}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Privacy Policy
                      </button>
                      . This includes consent for us to access your calendar data through Google Calendar and Microsoft Outlook APIs for the purpose of providing our calendar synchronization services.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    onClick={handleAccept}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    size="lg"
                  >
                    Accept & Continue
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    size="lg"
                  >
                    Decline
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  You can change your cookie preferences anytime in your browser settings.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-4"
              >
                <div className="flex justify-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Thank you for accepting!
                  </h3>
                  <p className="text-gray-600">
                    You can now enjoy the full EventHub experience with calendar synchronization.
                  </p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;

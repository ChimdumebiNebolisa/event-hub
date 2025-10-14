import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="About"
        description="Learn about Event Hub - Why we built a unified calendar management solution"
      />
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
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                About Event Hub
              </h1>
              <p className="text-xl text-muted-foreground">
                One place for all your calendars
              </p>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-soft p-8 sm:p-12 space-y-8"
            >
              {/* Why We Built This */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  Why Event Hub?
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We built Event Hub because we faced the same frustration many of you do: 
                    juggling multiple calendar apps, missing important events, and wasting time 
                    context-switching between Google Calendar, Outlook, and other platforms.
                  </p>
                  <p>
                    Event Hub solves this by bringing all your calendars into a single, unified 
                    view. No more tab-switching. No more missed meetings. Just one clean, 
                    beautiful interface that shows everything you need to know about your schedule.
                  </p>
                </div>
              </section>

              {/* Our Mission */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-primary" />
                  Our Mission
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Our mission is simple: make calendar management effortless. We believe your 
                    time is valuable, and you shouldn't have to waste it navigating between 
                    different calendar platforms.
                  </p>
                  <p>
                    Event Hub is designed to be fast, intuitive, and powerful - giving you the 
                    tools you need to stay organized without the complexity.
                  </p>
                </div>
              </section>

              {/* Key Features */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  What Makes Us Different
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Real-time Sync</h3>
                    <p className="text-sm text-muted-foreground">
                      Changes sync instantly across all your connected calendars
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Unified View</h3>
                    <p className="text-sm text-muted-foreground">
                      See all your events in one clean, scrollable timeline
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Privacy First</h3>
                    <p className="text-sm text-muted-foreground">
                      Your calendar data stays secure and is never shared
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Free Forever</h3>
                    <p className="text-sm text-muted-foreground">
                      Core features are always free, no credit card required
                    </p>
                  </div>
                </div>
              </section>

              {/* Built By */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Built by Calendar Users, for Calendar Users
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Event Hub was created by Chimdumebi Mitchell Nebolisa, a developer who 
                    experienced firsthand the frustration of managing multiple calendars. 
                  </p>
                  <p>
                    We're committed to continuously improving Event Hub based on user feedback 
                    and real-world needs. Have a suggestion or feature request? We'd love to 
                    hear from you at{' '}
                    <a 
                      href="mailto:chimdumebinebolisa@gmail.com"
                      className="text-primary hover:text-primary/80 underline"
                    >
                      chimdumebinebolisa@gmail.com
                    </a>
                  </p>
                </div>
              </section>

              {/* CTA */}
              <div className="pt-8 border-t border-border">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Ready to simplify your schedule?
                  </h3>
                  <Button
                    size="lg"
                    onClick={() => navigate('/signup')}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Get Started Free
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default About;


import { motion } from "framer-motion";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import logoEventHub from "@/assets/logo-eventhub.png";

const Navbar = () => {
  const { user, loading, signOut } = useAuthContext();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('Signed out successfully');
      // Redirect to home page after sign out
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileMenu();
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <img 
              src={logoEventHub} 
              alt="EventHub logo" 
              className="h-10 w-10 transition-transform group-hover:scale-110"
            />
            <span className="text-xl font-bold text-foreground">EventHub</span>
          </a>

          {/* Nav Links - Only show on landing page */}
          {!isDashboard && (
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Features
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isDashboard && isMobile && (
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          )}

          {/* Auth Section - Hidden on mobile when menu is open */}
          {!isMobile || (isMobile && !isMobileMenuOpen) ? (
            loading ? (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span className="text-foreground">{user.displayName || user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Sign out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a 
                  href="/signin" 
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-soft hover:shadow-medium text-sm font-medium"
                >
                  Sign in
                </a>
                <a 
                  href="/signup" 
                  className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-all text-sm font-medium"
                >
                  Sign up
                </a>
              </div>
            )
          ) : null}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && !isDashboard && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 top-16 z-50 md:hidden"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 w-80 max-w-[85vw] h-[calc(100vh-4rem)] bg-background border-l border-border shadow-2xl overflow-y-auto">
            <div className="p-6 pb-safe-area-inset-bottom space-y-6">
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* User Info (if logged in) */}
              {user && (
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">{user.displayName || user.email}</span>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-4">
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-all"
                >
                  How it Works
                </button>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-all"
                >
                  Features
                </button>
              </div>

              {/* Auth Actions */}
              {user ? (
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleSignOut();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-border space-y-3">
                  <a 
                    href="/signin" 
                    className="block w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-sm font-medium text-center"
                    onClick={closeMobileMenu}
                  >
                    Sign in
                  </a>
                  <a 
                    href="/signup" 
                    className="block w-full px-4 py-3 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-all text-sm font-medium text-center"
                    onClick={closeMobileMenu}
                  >
                    Sign up
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;

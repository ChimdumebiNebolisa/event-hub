import { motion } from "framer-motion";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import logoEventHub from "@/assets/logo-eventhub.png";

const Navbar = () => {
  const { user, loading, signOut } = useAuthContext();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

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

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                onClick={() => {
                  const element = document.getElementById('how-it-works');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                How it Works
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('features');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Features
              </button>
            </div>
          )}

          {/* Auth Section */}
          {loading ? (
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
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

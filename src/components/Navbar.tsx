import { motion } from "framer-motion";
import logoEventHub from "@/assets/logo-eventhub.png";

const Navbar = () => {
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

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              How it Works
            </a>
            <a 
              href="/signup" 
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-soft hover:shadow-medium text-sm font-medium"
            >
              Sign in
            </a>
          </div>

          {/* Mobile menu button */}
          <a 
            href="/signup" 
            className="md:hidden px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-soft text-sm font-medium"
          >
            Sign in
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

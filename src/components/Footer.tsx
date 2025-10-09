import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import brandIcon from "@/assets/brand-icon-eventhub.png";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={brandIcon} 
                alt="Event Hub brand icon" 
                className="h-8 w-8"
              />
              <h3 className="text-xl font-bold text-foreground">Event Hub</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              All your calendars and events — finally in one place.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com/ChimdumebiNebolisa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-soft"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/chimdumebi-nebolisa-020162389/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-soft"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:chimdumebinebolisa@gmail.com"
                className="w-10 h-10 rounded-lg bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-soft"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              © 2025 Event Hub. Built with ❤️ by{' '}
              <a
                href="mailto:chimdumebinebolisa@gmail.com"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Chimdumebi Mitchell Nebolisa
              </a>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Contact:{' '}
              <a
                href="mailto:chimdumebinebolisa@gmail.com"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                chimdumebinebolisa@gmail.com
              </a>
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              to="/terms-of-service"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy-policy"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

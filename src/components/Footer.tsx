import { Github, Linkedin, Mail } from "lucide-react";
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
                alt="EventHub brand icon" 
                className="h-8 w-8"
              />
              <h3 className="text-xl font-bold text-foreground">EventHub</h3>
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
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-soft"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-soft"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@eventhub.com"
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
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © 2025 EventHub. Built with ❤️ by Chimdumebi Mitchell Nebolisa.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

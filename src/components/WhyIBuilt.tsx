import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

const WhyIBuilt = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-card rounded-3xl p-8 sm:p-12 shadow-large">
            {/* Quote icon */}
            <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-medium">
              <Quote className="w-6 h-6 text-white" />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6 mt-4">
                Why I Built This
              </h2>

              <blockquote className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                "As a student juggling multiple Google and Outlook accounts, I kept missing meetings.
                EventHub was built to make life simpler — one feed, zero chaos."
              </blockquote>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-border">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                CN
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Chimdumebi Mitchell Nebolisa
                </p>
                <p className="text-sm text-muted-foreground">
                  Creator of EventHub
                </p>
              </div>
            </div>

            {/* Decorative gradient */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyIBuilt;

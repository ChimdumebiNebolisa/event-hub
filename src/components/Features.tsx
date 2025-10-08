import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, Tag, RefreshCw, Sparkles } from "lucide-react";
import calendarInterface from "@/assets/calendar-interface.png";

const features = [
  {
    icon: Calendar,
    title: "Unified timeline of all events",
    description: "See your entire schedule from multiple calendars in one clean feed.",
  },
  {
    icon: Tag,
    title: "Add personal tags",
    description: "Organize events with custom tags for work, personal, urgent, and more.",
  },
  {
    icon: RefreshCw,
    title: "Auto-sync every 15 minutes",
    description: "Always stay up-to-date with automatic background synchronization.",
  },
  {
    icon: Sparkles,
    title: "Beautiful, minimal UI",
    description: "A clean interface that lets you focus on what matters—your schedule.",
  },
];

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="py-24 bg-gradient-feature">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Key Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your calendars effortlessly
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Features grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="bg-card rounded-xl p-6 shadow-soft hover-lift"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Mockup image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-large">
              <img
                src={calendarInterface}
                alt="EventHub calendar interface showing multiple calendar views"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 mix-blend-overlay" />
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
            
            {/* Interface description */}
            <p className="text-center text-muted-foreground mt-8 text-sm sm:text-base">
              The interface is clean, intuitive, and easily customizable to fit any workflow.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;

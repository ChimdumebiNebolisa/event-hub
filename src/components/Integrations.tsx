import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import googleCalendarIcon from "@/assets/google-calendar-icon.png";
import outlookIcon from "@/assets/outlook-icon.png";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Integrations = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const integrations = [
    {
      name: "Google Calendar",
      icon: googleCalendarIcon,
      description: "Sync all your Google Calendar events",
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      name: "Outlook Calendar",
      icon: outlookIcon,
      description: "Connect your Microsoft Outlook calendar",
      color: "from-blue-600/20 to-cyan-500/20"
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.05),transparent)]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Sync Your Calendars
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect your favorite calendar services and see all your events in one unified timeline.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 shadow-soft hover:shadow-large">
                {/* Gradient background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${integration.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-20 h-20 mb-6 mx-auto rounded-2xl bg-background shadow-medium flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src={integration.icon} 
                      alt={`${integration.name} icon`}
                      className="w-14 h-14 object-contain"
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {integration.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-large group"
            onClick={() => (window.location.href = "/signup")}
          >
            Connect Your Calendars
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Free to use · Connect unlimited calendars
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Integrations;

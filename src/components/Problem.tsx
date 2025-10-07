import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import calendarsImage from "@/assets/calendars-merge.png";

const Problem = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-gradient-feature">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Tired of switching between Google and Outlook?
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            We all miss meetings, double-book events, or forget plans because our calendars are scattered.{" "}
            <span className="text-primary font-medium">EventHub fixes that</span> by merging everything into one scrollable timeline.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative max-w-md mx-auto"
          >
            <div className="relative">
              <img
                src={calendarsImage}
                alt="Two separate calendars merging into one unified calendar"
                className="w-full h-auto"
              />
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-sm text-muted-foreground mt-6 italic"
            >
              One feed. Zero chaos.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Problem;

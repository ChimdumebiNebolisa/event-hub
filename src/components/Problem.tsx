import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const Problem = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-gradient-feature">
      <div className="container mx-auto px-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-6 sm:mb-8">
            Tired of switching between Google and Outlook?
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-10 sm:mb-12 max-w-3xl mx-auto">
            We all miss meetings, double-book events, or forget plans because our calendars are scattered.{" "}
            <span className="text-primary font-medium">EventHub fixes that</span> by merging everything into one scrollable timeline.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative max-w-6xl mx-auto"
          >
            {/* Enhanced timeline animation - Simplified on mobile */}
            <div className="relative w-full h-64 md:h-96 mx-auto flex items-center justify-center">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-orange-500/5 rounded-3xl blur-3xl" />
              
              {/* Timeline visualization */}
              <div className="relative w-full max-w-5xl">
                {/* Enhanced timeline line with progress effect */}
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2 overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-full relative"
                  >
                    {/* Moving highlight */}
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={isInView ? { x: "100%" } : {}}
                      transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                    />
                  </motion.div>
                </div>

                {/* Timeline nodes */}
                <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2">
                  {/* Start node */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
                    className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg"
                  />
                  
                  {/* Middle node */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
                    className="w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-lg"
                  />
                  
                  {/* End node */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 2.3, duration: 0.5, type: "spring" }}
                    className="w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg"
                  />
                </div>

                {/* Before state - scattered calendars with enhanced design */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4"
                >
                  <div className="text-center">
                    <div className="flex gap-4 mb-6">
                      {/* Google Calendar with enhanced design */}
                      <motion.div
                        initial={{ scale: 0, rotate: -15, y: 20 }}
                        animate={isInView ? { scale: 1, rotate: 0, y: 0 } : {}}
                        transition={{ delay: 1, duration: 0.6, type: "spring" }}
                        className="relative group"
                      >
                        <div className="w-20 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-300">
                          <span className="text-white font-bold text-xl">G</span>
                        </div>
                        {/* Notification badge */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={isInView ? { scale: 1 } : {}}
                          transition={{ delay: 1.5, duration: 0.3 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <span className="text-white text-xs font-bold">!</span>
                        </motion.div>
                      </motion.div>
                      
                      {/* Outlook Calendar with enhanced design */}
                      <motion.div
                        initial={{ scale: 0, rotate: 15, y: 20 }}
                        animate={isInView ? { scale: 1, rotate: 0, y: 0 } : {}}
                        transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
                        className="relative group"
                      >
                        <div className="w-20 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-300">
                          <span className="text-white font-bold text-xl">O</span>
                        </div>
                        {/* Notification badge */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={isInView ? { scale: 1 } : {}}
                          transition={{ delay: 1.7, duration: 0.3 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <span className="text-white text-xs font-bold">!</span>
                        </motion.div>
                      </motion.div>
                    </div>
                    <div className="bg-gray-100 rounded-full px-4 py-2 inline-block">
                      <p className="text-sm text-gray-700 font-semibold">Before: Scattered</p>
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced arrow with pulsing effect - centered */}
                <motion.div
                  initial={{ opacity: 0, x: -30, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                  transition={{ delay: 1.8, duration: 0.6, type: "spring" }}
                  className="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                >
                  <motion.div
                    animate={{ 
                      x: [0, 8, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                    {/* Pulsing ring */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0, 0.3]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                      className="absolute inset-0 border-2 border-purple-400 rounded-full"
                    />
                  </motion.div>
                </motion.div>

                {/* After state - unified calendar with enhanced design */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 2.2, duration: 0.8, type: "spring" }}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: 180, y: 20 }}
                      animate={isInView ? { scale: 1, rotate: 0, y: 0 } : {}}
                      transition={{ delay: 2.5, duration: 1, type: "spring" }}
                      className="relative group"
                    >
                      <div className="relative w-24 h-28 bg-gradient-to-br from-blue-400 via-purple-500 to-purple-700 rounded-2xl shadow-2xl mx-auto transform group-hover:scale-105 transition-all duration-300">
                    {/* Calendar binding rings */}
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    </div>
                    
                        {/* Calendar pages with more detail */}
                        <div className="absolute inset-4 flex justify-center items-center">
                          <motion.div
                            initial={{ rotate: -15, x: -8 }}
                            animate={isInView ? { rotate: 0, x: 0 } : {}}
                            transition={{ delay: 3, duration: 0.6 }}
                            className="absolute left-2 bg-white/95 rounded-lg p-2 shadow-lg w-7 h-9 flex flex-col items-center justify-center"
                          >
                            <span className="text-xs font-bold text-blue-600">1</span>
                            <div className="w-full h-px bg-gray-300 my-1"></div>
                            <div className="w-2 h-1 bg-blue-400 rounded-sm"></div>
                          </motion.div>
                          
                      <motion.div
                            initial={{ rotate: 15, x: 8 }}
                        animate={isInView ? { rotate: 0, x: 0 } : {}}
                            transition={{ delay: 3.2, duration: 0.6 }}
                            className="absolute right-2 bg-white/95 rounded-lg p-2 shadow-lg w-7 h-9 flex flex-col items-center justify-center"
                      >
                            <span className="text-xs font-bold text-purple-600">12</span>
                            <div className="w-full h-px bg-gray-300 my-1"></div>
                            <div className="w-2 h-1 bg-purple-400 rounded-sm"></div>
                      </motion.div>
                        </div>
                        
                        {/* Enhanced shine effect */}
                        <motion.div
                          animate={{ 
                            x: ['-100%', '100%'],
                            opacity: [0, 0.4, 0]
                          }}
                          transition={{ 
                            duration: 2.5, 
                            repeat: Infinity,
                            delay: 3.5
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl"
                        />
                      </div>
                      
                      {/* Success checkmark */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ delay: 3.8, duration: 0.5, type: "spring" }}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <span className="text-white text-sm font-bold">✓</span>
                      </motion.div>
                    </motion.div>
                    
                    <div className="bg-green-100 rounded-full px-4 py-2 inline-block mt-4">
                      <p className="text-sm text-green-700 font-semibold">After: Unified</p>
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced data flow with particles */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 3, duration: 0.5 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {/* Data flow particles with different sizes and speeds */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                  animate={{
                        x: [0, 300, 600],
                    opacity: [0, 1, 0],
                        scale: [0.3, 1, 0.3],
                  }}
                  transition={{
                        duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                        delay: 3.5 + (i * 0.3),
                      }}
                      className="absolute rounded-full"
                      style={{
                        width: `${4 + (i % 3) * 2}px`,
                        height: `${4 + (i % 3) * 2}px`,
                        background: `linear-gradient(45deg, ${
                          i % 2 === 0 ? '#3B82F6' : '#8B5CF6'
                        }, ${
                          i % 2 === 0 ? '#8B5CF6' : '#F97316'
                        })`,
                        top: `${25 + (i * 8)}%`,
                        left: '15%',
                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                      }}
                    />
                  ))}
                </motion.div>

                {/* Enhanced success indicators with better positioning - Hidden on mobile */}
                <motion.div
                  initial={{ scale: 0, opacity: 0, x: 20 }}
                  animate={isInView ? { scale: 1, opacity: 1, x: 0 } : {}}
                  transition={{ delay: 4, duration: 0.6, type: "spring" }}
                  className="hidden md:block absolute right-1/4 top-1/4"
                >
                  <div className="flex items-center gap-2 bg-green-50 border-2 border-green-200 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-3 h-3 bg-green-500 rounded-full"
                    />
                    <span className="text-sm font-semibold text-green-700">Synced</span>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0, opacity: 0, x: 20 }}
                  animate={isInView ? { scale: 1, opacity: 1, x: 0 } : {}}
                  transition={{ delay: 4.3, duration: 0.6, type: "spring" }}
                  className="hidden md:block absolute right-1/4 bottom-1/4"
                >
                  <div className="flex items-center gap-2 bg-blue-50 border-2 border-blue-200 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
                      className="w-3 h-3 bg-blue-500 rounded-full"
                    />
                    <span className="text-sm font-semibold text-blue-700">Real-time</span>
                  </div>
                </motion.div>

                {/* Additional floating elements - Hidden on mobile */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 4.6, duration: 0.5 }}
                  className="hidden md:block absolute left-1/4 top-1/4"
                >
                  <div className="flex items-center gap-2 bg-purple-50 border-2 border-purple-200 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full"
                    />
                    <span className="text-sm font-semibold text-purple-700">Processing</span>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 4.8, duration: 0.8 }}
              className="text-xl text-muted-foreground mt-10 text-center font-semibold"
            >
              One timeline. All your calendars. Zero confusion.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Problem;

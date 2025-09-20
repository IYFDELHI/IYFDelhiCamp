'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Bus, MapPin, Users, AlertTriangle, Heart } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

const CampInformation = () => {
  const campInfo = [
    {
      icon: Calendar,
      title: "Camp Duration",
      description: "17th, 18th, and 19th October 2025",
      gradient: "rgba(251, 146, 60, 0.2)", // Orange
      iconGradient: "from-orange-400 to-red-500"
    },
    {
      icon: Clock,
      title: "Return Schedule", 
      description: "Return on the night of 19th October 2025",
      gradient: "rgba(59, 130, 246, 0.2)", // Blue
      iconGradient: "from-blue-400 to-indigo-500"
    },
    {
      icon: Bus,
      title: "Transportation",
      description: "Round-trip bus service included in camp fee",
      gradient: "rgba(34, 197, 94, 0.2)", // Green
      iconGradient: "from-green-400 to-emerald-500"
    },
    {
      icon: MapPin,
      title: "Local Transport",
      description: "Local transportation at attendees' own expense",
      gradient: "rgba(168, 85, 247, 0.2)", // Purple
      iconGradient: "from-purple-400 to-pink-500"
    },
    {
      icon: Users,
      title: "Accommodation",
      description: "4 devotees per room - shared accommodation",
      gradient: "rgba(245, 158, 11, 0.2)", // Amber
      iconGradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: AlertTriangle,
      title: "Limited Rooms",
      description: "Register early - rooms are limited",
      gradient: "rgba(239, 68, 68, 0.2)", // Red
      iconGradient: "from-red-400 to-pink-500"
    },
    {
      icon: Heart,
      title: "Health Care",
      description: "Carry your own basic medicines as required",
      gradient: "rgba(20, 184, 166, 0.2)", // Teal
      iconGradient: "from-teal-400 to-cyan-500"
    }
  ];

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-orange-50/50 via-white to-orange-50/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Important Information
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Essential detail for the Camp
          </p>
        </motion.div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {campInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <SpotlightCard 
                   className="h-full bg-white/90 backdrop-blur-sm border-gray-200/50 p-5 hover:shadow-lg transition-all duration-300"
                   spotlightColor={info.gradient}
                 >
                   {/* Icon */}
                   <div className="flex items-center mb-3">
                     <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${info.iconGradient} mr-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                       <IconComponent className="w-6 h-6 text-white" />
                     </div>
                     <h3 className="text-lg font-semibold text-gray-900">
                       {info.title}
                     </h3>
                   </div>

                   {/* Content */}
                   <p className="text-gray-700 text-sm leading-relaxed">
                     {info.description}
                   </p>
                 </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.3 }}
           viewport={{ once: true }}
         >
           <SpotlightCard 
             className="text-center bg-gradient-to-r from-orange-100/90 to-red-100/90 backdrop-blur-sm border-orange-300/50 p-6 hover:shadow-xl transition-all duration-300"
             spotlightColor="rgba(251, 146, 60, 0.25)"
           >
             <div className="flex items-center justify-center mb-3">
               <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-orange-500 mr-3 shadow-lg">
                 <AlertTriangle className="w-6 h-6 text-white" />
               </div>
               <h3 className="text-xl font-bold text-gray-900">
                 Register Early
               </h3>
             </div>
             <p className="text-gray-700 font-medium">
               Limited seats available for this transformative spiritual experience
             </p>
           </SpotlightCard>
         </motion.div>
      </div>
    </section>
  );
};

export default CampInformation;
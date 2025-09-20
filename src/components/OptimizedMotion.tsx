'use client';

import { motion, MotionProps, useReducedMotion } from 'framer-motion';
import { ReactNode, useMemo } from 'react';

interface OptimizedMotionProps extends MotionProps {
  children: ReactNode;
  className?: string | undefined;
  reduceMotion?: boolean | undefined;
}

// Optimized motion div with performance considerations
export const OptimizedMotionDiv = ({ 
  children, 
  className = '', 
  reduceMotion = false,
  ...motionProps 
}: OptimizedMotionProps) => {
  const shouldReduceMotion = useReducedMotion();
  
  const optimizedProps = useMemo(() => {
    if (shouldReduceMotion || reduceMotion) {
      // Disable animations for users who prefer reduced motion
      return {
        initial: false,
        animate: false,
        exit: undefined,
        transition: { duration: 0 }
      };
    }
    
    // Optimize animations for performance
    return {
      ...motionProps,
      transition: {
        type: "tween" as const,
        ease: "easeOut" as const,
        duration: 0.3,
        ...motionProps.transition
      }
    };
  }, [shouldReduceMotion, reduceMotion, motionProps]);

  // Filter out undefined values to satisfy exactOptionalPropertyTypes
  const motionDivProps = Object.fromEntries(
    Object.entries(optimizedProps).filter(([, value]) => value !== undefined)
  );

  return (
    <motion.div 
      className={className}
      {...motionDivProps}
      style={{
        willChange: 'transform, opacity',
        ...(motionProps.style || {})
      }}
    >
      {children}
    </motion.div>
  );
};

// Optimized stagger container
export const StaggerContainer = ({ 
  children, 
  className = '',
  staggerDelay = 0.1,
  ...props 
}: OptimizedMotionProps & { staggerDelay?: number | undefined }) => {
  const shouldReduceMotion = useReducedMotion();
  
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      }
    }
  }), [shouldReduceMotion, staggerDelay]);

  return (
    <OptimizedMotionDiv
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </OptimizedMotionDiv>
  );
};

// Optimized fade in animation
export const FadeIn = ({ 
  children, 
  className = '',
  delay = 0,
  duration = 0.3,
  ...props 
}: OptimizedMotionProps & { delay?: number | undefined; duration?: number | undefined }) => {
  const shouldReduceMotion = useReducedMotion();
  
  const fadeVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: "easeOut" as const
      }
    }
  }), [shouldReduceMotion, delay, duration]);

  return (
    <OptimizedMotionDiv
      className={className}
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </OptimizedMotionDiv>
  );
};

// Optimized hover scale effect
export const HoverScale = ({ 
  children, 
  className = '',
  scale = 1.05,
  ...props 
}: OptimizedMotionProps & { scale?: number | undefined }) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <OptimizedMotionDiv
      className={className}
      whileHover={shouldReduceMotion ? {} : { 
        scale,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      {...props}
    >
      {children}
    </OptimizedMotionDiv>
  );
};
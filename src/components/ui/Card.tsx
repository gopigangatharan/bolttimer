/**
 * Reusable Card component
 */
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow cursor-pointer' : '';
  
  const classes = [
    baseClasses,
    paddingClasses[padding],
    hoverClasses,
    className,
  ].filter(Boolean).join(' ');

  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -2 },
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  } : {};

  return (
    <Component className={classes} {...motionProps}>
      {children}
    </Component>
  );
}
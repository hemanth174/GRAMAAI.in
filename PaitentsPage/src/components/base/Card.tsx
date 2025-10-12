
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export default function Card({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false 
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  
  return (
    <div className={`bg-white rounded-xl shadow-md ${paddingClasses[padding]} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}


import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
}

export const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'md'
}: CardProps) => {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const shadows = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };
  
  return (
    <div className={`bg-white rounded-lg ${shadows[shadow]} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

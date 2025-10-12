
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200 whitespace-nowrap cursor-pointer flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-[#1fa27e] text-white hover:bg-[#178a69]',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border-2 border-[#1fa27e] text-[#1fa27e] hover:bg-[#1fa27e] hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

import { Color } from '../styles/color.js';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  href,
  className = '',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';
  
  const variants = {
    primary: `bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500`,
    secondary: `bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500`,
    outline: `border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500`
  };
  
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  
  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
}
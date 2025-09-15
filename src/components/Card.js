export default function Card({ 
  children, 
  className = '', 
  hover = true,
  padding = 'medium',
  ...props 
}) {
  const baseClasses = 'bg-white border border-gray-200 rounded-xl transition-all duration-200';
  
  const hoverClasses = hover ? 'hover:shadow-lg hover:border-gray-300 hover:-translate-y-1' : '';
  
  const paddingClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };
  
  const classes = `${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
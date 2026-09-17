import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary: 'bg-[#5B5CE2] text-white hover:bg-[#4A4BC7] shadow-sm hover:shadow-md hover:shadow-[#5B5CE2]/20',
    secondary: 'bg-[#19B87A] text-white hover:bg-[#159c67] shadow-sm hover:shadow-md hover:shadow-[#19B87A]/20',
    outline: 'border border-[#E7E7EC] bg-white text-[#15151A] hover:bg-[#F7F7FA] hover:border-[#5B5CE2]/40',
    ghost: 'text-[#15151A] hover:bg-[#EEF0FF] hover:text-[#5B5CE2]',
    danger: 'bg-[#EF4444] text-white hover:bg-[#dc2626]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-4 py-2.5 text-[15px] gap-2 rounded-xl',
    lg: 'px-6 py-3.5 text-base gap-2.5 rounded-xl',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

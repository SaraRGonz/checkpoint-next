'use client'

import type { ButtonHTMLAttributes } from 'react';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

const variantStyles = {
    primary: 'text-primarybutton-text bg-primarybutton-bg hover:bg-primarybutton-bghover active:bg-primarybutton-bgactive',
    secondary: 'text-secondarybutton-text bg-secondarybutton-bg hover:bg-secondarybutton-bghover active:bg-secondarybutton-bgactive',
    danger: 'text-dangerbutton-text bg-dangerbutton-bg hover:bg-dangerbutton-bghover active:bg-dangerbutton-bgactive',
}

export function Button({ 
    children, 
    variant = 'primary', 
    className = '',
    ...props
}: ButtonProps) {
    
    const baseStyles = 'px-4 py-2 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';    
    
    const finalClasses = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

    return (
        <button 
            className={finalClasses} 
            {...props} 
        >
            {children}
        </button>
    );
}
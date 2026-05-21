'use client'

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Button } from './Button'; 
import { CrossIcon } from './Icons';

export interface ModalButton {
    content: string;
    variant?: 'primary' | 'secondary' | 'danger';
    onClick?: () => void;
    disabled?: boolean;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footerButtons?: ModalButton[]; 
    closeIconClassName?: string;
    variant?: 'default' | 'cyberpunk';
    maxWidthClassName?: string;
}

export function Modal({ isOpen, onClose, title, children, footerButtons, closeIconClassName, variant = 'default', maxWidthClassName }: ModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const isCyberpunk = variant === 'cyberpunk';

    const containerClasses = isCyberpunk
        ? `bg-gray-950 border border-primary/50 shadow-[0_0_30px_rgba(var(--color-primary),0.15)] shadow-primary/10 rounded-lg w-full flex flex-col animate-in zoom-in-95 duration-200 ${maxWidthClassName || 'max-w-5xl lg:max-w-6xl'}`
        : `bg-gray-800 rounded-lg shadow-xl w-full flex flex-col animate-in zoom-in-95 duration-200 ${maxWidthClassName || 'max-w-md'}`;

    const headerClasses = isCyberpunk
        ? "flex justify-between items-center p-6 border-b border-primary/30 bg-gradient-to-r from-primary/10 via-gray-900/50 to-transparent relative overflow-hidden"
        : "flex justify-between items-center p-4 border-b border-gray-700";

    const titleClasses = isCyberpunk
        ? "text-2xl font-black text-primary uppercase tracking-[0.2em] drop-shadow-md"
        : "text-xl font-bold text-text";

    const contentClasses = isCyberpunk
        ? "p-6 lg:p-8 text-gray-300 overflow-y-auto max-h-[85vh]"
        : "p-6 text-gray-300 overflow-y-auto max-h-[85vh]";

    const closeBtnClasses = closeIconClassName || (isCyberpunk
        ? "text-primary hover:text-white cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 bg-primary/10 p-2 rounded-md hover:bg-primary/30"
        : "text-gray-400 hover:text-white cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div 
                className={containerClasses}
                role="dialog"
                aria-modal="true"
            >
                <div className={headerClasses}>
                    {isCyberpunk && <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-50" />}
                    <h2 className={titleClasses}>{title}</h2>
                    <button 
                        onClick={onClose}
                        className={closeBtnClasses}
                    >
                        <CrossIcon className="cursor-pointer w-6 h-6" />
                    </button>
                </div>
                
                <div className={contentClasses}>
                    {children}
                </div>

                {footerButtons && footerButtons.length > 0 && (
                    <div className={`p-4 border-t flex justify-end gap-3 ${isCyberpunk ? 'border-primary/30 bg-gray-950/50' : 'border-gray-700 bg-gray-900/50'}`}>
                        {footerButtons.map((btn, index) => (
                            <Button 
                                key={index} 
                                variant={btn.variant || 'secondary'} 
                                onClick={btn.onClick || onClose}
                                disabled={btn.disabled}
                            >
                                {btn.content}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
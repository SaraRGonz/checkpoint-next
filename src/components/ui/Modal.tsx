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
}

export function Modal({ isOpen, onClose, title, children, footerButtons, closeIconClassName }: ModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 flex flex-col animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-text">{title}</h2>
                    <button 
                        onClick={onClose}
                        className={closeIconClassName || "text-gray-400 hover:text-white transition-colors"}
                    >
                        <CrossIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 text-gray-300">
                    {children}
                </div>

                {footerButtons && footerButtons.length > 0 && (
                    <div className="p-4 border-t border-gray-700 flex justify-end gap-3 bg-gray-900/50">
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
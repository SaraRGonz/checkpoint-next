'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion'; 
import { LogoIcon, HomeIcon, LibraryIcon, WishlistNavIcon, CrossIcon, MenuIcon } from '@/components/ui/Icons';

export function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="bg-background border-b border-gray-800 relative z-50">
            {/* contenedor principal de la barra */}
            <div className="px-6 py-4 flex items-center justify-between relative z-50 bg-background">
                
                {/* IZQUIERDA LOGO */}
                <Link href="/" className="flex items-center gap-3 group" onClick={closeMenu}>
                    <div className="text-primary group-hover:scale-110 transition-transform">
                        <LogoIcon className="w-8 h-8" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-text uppercase">Checkpoint</span>
                </Link>

                {/* CENTRO NAVEGACIÓN desktop visible, móvil oculto */}
                <div className="hidden md:flex items-center bg-gray-900/40 border border-gray-700/50 rounded-full p-1 shadow-inner absolute left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 relative">
                        <NavItem href="/" active={isActive('/')} label="Home" icon={HomeIcon} />
                        <NavItem href="/library" active={isActive('/library')} label="Library" icon={LibraryIcon} />
                        <NavItem href="/wishlist" active={isActive('/wishlist')} label="Wishlist" icon={WishlistNavIcon} />
                    </div>
                </div>

                {/* DERECHA TOGGLE TEMA desktop visible, móvil oculto */}
                <button onClick={toggleTheme} className="hidden md:flex w-10 h-10 rounded-full items-center justify-center bg-gray-800 border border-gray-700 hover:border-primary text-accent transition-all">
                    {theme === 'dark' ? "☀️" : "🌙"}
                </button>

                {/* CONTROLES MÓVILES desktop oculto, móvil visible m*/}
                <div className="flex items-center gap-3 md:hidden">
                    <button onClick={toggleTheme} className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 border border-gray-700 text-accent transition-all">
                        {theme === 'dark' ? "☀️" : "🌙"}
                    </button>
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-gray-400 hover:text-white p-1 transition-colors"
                    >
                        {isMobileMenuOpen ? <CrossIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
                    </button>
                </div>
            </div>

            {/* MENÚ DESPLEGABLE MÓVIL */}
            {isMobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-full left-0 w-full bg-gray-900 border-b border-gray-800 shadow-2xl py-4 px-4 flex flex-col gap-2 z-40"
                >
                    <NavItem href="/" active={isActive('/')} label="Home" icon={HomeIcon} onClick={closeMenu} />
                    <NavItem href="/library" active={isActive('/library')} label="Library" icon={LibraryIcon} onClick={closeMenu} />
                    <NavItem href="/wishlist" active={isActive('/wishlist')} label="Wishlist" icon={WishlistNavIcon} onClick={closeMenu} />
                </motion.div>
            )}
        </nav>
    );
}

function NavItem({ href, active, label, icon: Icon, onClick }: { href: string; active: boolean; label: string; icon: React.ElementType, onClick?: () => void }) {
    return (
        <Link 
            href={href}
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-3 md:py-2 rounded-xl md:rounded-full transition-colors duration-300 relative group ${
                active ? 'text-primary bg-gray-800/50 md:bg-transparent' : 'text-gray-400 hover:text-white hover:bg-gray-800/30 md:hover:bg-transparent'
            }`}
        >
            {/* foco animado para desktop */}
            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="hidden md:block absolute inset-0 bg-gray-800 rounded-full shadow-lg ring-1 ring-gray-700 z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} 
                />
            )}

            {/* contenido icono y texto */}
            <div className="relative z-10 flex items-center gap-3 md:gap-2 w-full">
                <div className={`w-8 h-8 md:w-6 md:h-6 rounded-full border flex items-center justify-center transition-colors ${
                    active ? 'border-primary' : 'border-gray-600'
                }`}>
                    <Icon className="w-4 h-4 md:w-3 md:h-3" />
                </div>
                <span className={`text-base md:text-xs font-bold uppercase tracking-widest ${active ? 'text-text' : ''}`}>
                    {label}
                </span>
            </div>
        </Link>
    );
}
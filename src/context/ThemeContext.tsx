'use client'

import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {

    // inicializa el estado siempre en dark
    const [theme, setTheme] = useState<Theme>('dark');

    // efecto de montaje que se ejecuta solo en el navegador del usuario
    // lee el localStorage y actualiza si el usuario prefiere light
    useEffect(() => {
        const saved = localStorage.getItem('checkpoint-theme');
        if (saved === 'light' || saved === 'dark') {
            setTheme(saved);
        }
    }, []);

    // efecto de sincronización que vigila la variable 'theme'
    // si cambia lo guarda en localStorage y actualiza el html
    useEffect(() => {
        localStorage.setItem('checkpoint-theme', theme);
        
        const htmlElement = document.documentElement;
        if (theme === 'light') {
            htmlElement.classList.add('light');
        } else {
            htmlElement.classList.remove('light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
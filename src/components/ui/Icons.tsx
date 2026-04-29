import type { SVGProps } from 'react';

// permite que a cualquier icono se le pueda pasar clases de tailwind o propiedades nativas de un svg como onclick
interface IconProps extends SVGProps<SVGSVGElement> {}

// logo de checkpoint
export function LogoIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
            <path d="M6 12h4M8 10v4M15 11v.01M18 13v.01M21 15a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v6Z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

// lupa
export function SearchIcon(props: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
    );
}

// flecha hacia abajo
export function ChevronDownIcon(props: IconProps) {
    return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
    );
}

// check 
export function CheckIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

// casa
export function HomeIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" {...props}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// x del navbar para library
export function LibraryIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" {...props}>
            <path d="M18 6L6 18M6 6l12 12" />
        </svg>
    );
}

// círculo del navbar para wishlist
export function WishlistNavIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" {...props}>
            <circle cx="12" cy="12" r="6" />
        </svg>
    );
}

// triángulo del navbar para search
export function SearchNavIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" {...props}>
            <path d="M12 6l6 12H6z" />
        </svg>
    );
}

// cuadrado del navbar para addgame
export function AddGameIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" {...props}>
            <rect x="6" y="6" width="12" height="12" rx="1" />
        </svg>
    );
}

// estrella
export function StarIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/> 
        </svg>
    );
}

// lápiz con libreta
export function EditIcon(props: IconProps) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
    );
}

// cubo de basura
export function TrashIcon(props: IconProps) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}

// disquete "guardar"
export function SaveIcon(props: IconProps) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    );
}

// una x
export function CrossIcon(props: IconProps) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );
}

// triángulo alerta
export function AlertIcon(props: IconProps) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    );
}

// fantasma
export function GhostIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M50.3,87.7c-1.1,0-2.2-0.3-3.1-1l-10.1-7c-0.8-0.5-1.8-0.6-2.6-0.1l-8.8,5.2c-1.7,1-3.7,1-5.5,0c-1.7-1-2.7-2.7-2.7-4.7 V43.9c0-17.9,14.6-32.5,32.5-32.5s32.5,14.6,32.5,32.5v36.4c0,2-1,3.7-2.7,4.7c-1.7,1-3.7,1-5.4,0l-8.9-5.2 c-0.8-0.5-1.9-0.4-2.7,0.1l-9.3,6.8C52.5,87.4,51.4,87.7,50.3,87.7z M35.7,76.4c1.1,0,2.2,0.3,3.1,1l10.1,7c0.9,0.6,2,0.6,2.8,0 l9.3-6.8c1.7-1.3,4.1-1.4,6-0.3l8.9,5.2l0,0c0.8,0.4,1.7,0.4,2.4,0c0.8-0.4,1.2-1.2,1.2-2.1V43.9c0-16.3-13.2-29.5-29.5-29.5 S20.5,27.6,20.5,43.9v36.4c0,0.9,0.5,1.7,1.2,2.1c0.8,0.4,1.7,0.4,2.4,0l8.8-5.2C33.8,76.6,34.7,76.4,35.7,76.4z M35.9,54.1 c-4.9,0-8.8-4-8.8-8.8c0-4.9,4-8.8,8.8-8.8s8.8,4,8.8,8.8C44.7,50.1,40.7,54.1,35.9,54.1z M35.9,39.5c-3.2,0-5.8,2.6-5.8,5.8 c0,3.2,2.6,5.8,5.8,5.8s5.8-2.6,5.8-5.8C41.7,42.1,39.1,39.5,35.9,39.5z M64.3,54.1c-4.9,0-8.8-4-8.8-8.8c0-4.9,4-8.8,8.8-8.8 s8.8,4,8.8,8.8C73.1,50.1,69.2,54.1,64.3,54.1z M64.3,39.5c-3.2,0-5.8,2.6-5.8,5.8c0,3.2,2.6,5.8,5.8,5.8s5.8-2.6,5.8-5.8 C70.1,42.1,67.5,39.5,64.3,39.5z M32.4,30.6c0.1-0.1,5.8-7.2,13.8-7.7c0.8,0,1.5-0.8,1.4-1.6c0-0.8-0.7-1.4-1.6-1.4 c-9.3,0.5-15.7,8.5-16,8.8c-0.5,0.6-0.4,1.6,0.2,2.1c0.3,0.2,0.6,0.3,0.9,0.3C31.7,31.1,32.1,30.9,32.4,30.6z" />
        </svg>
    );
}

// un +
export function PlusIcon(props: IconProps) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
    );
}

// corazón
export function HeartIcon(props: IconProps) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    );
}

//icono de menú
export function MenuIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

// flecha hacia la izquierda
export function ArrowLeftIcon(props: IconProps) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    );
}

// flecha hacia la derecha
export function ArrowRightIcon(props: IconProps) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    );
}

// icono de cuadrícula (grid)
export function GridIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
    );
}

// icono de columnas (kanban)
export function KanbanIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <rect x="3" y="3" width="5" height="18" rx="1" />
            <rect x="9.5" y="3" width="5" height="12" rx="1" />
            <rect x="16" y="3" width="5" height="15" rx="1" />
        </svg>
    );
}
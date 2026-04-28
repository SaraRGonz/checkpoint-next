
// formatea una fecha ISO a un formato legible (ej: 15 Abr 2026)
export const formatDate = (isoString?: string): string => {
    if (!isoString) return 'Unknown date';
    return new Date(isoString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};


// Asegura que el rating siempre tenga un decimal si es necesario
export const formatRating = (rating: number): string => {
    return rating === 0 ? 'N/A' : rating.toFixed(1);
};
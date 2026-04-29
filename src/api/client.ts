const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL 
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api` 
    : '/api';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        if (response.status !== 204) {
            const data = await response.json();
            throw new Error(data.error?.message || 'Error en la petición a la API');
        }
        throw new Error(`Error HTTP: ${response.status}`);
    }

    if (response.status === 204) {
        return {} as T;
    }

    const data = await response.json();
    return data as T;
}
// src/utils/geolocation.ts

export interface Location {
    latitude: number;
    longitude: number;
}

/**
 * Obtiene la ubicación actual del dispositivo usando la API de Geolocalización del navegador.
 * Retorna una promesa con latitud y longitud, o null si el usuario deniega el permiso
 * o si ocurre un error.
 */
export async function getCurrentLocation(): Promise<Location | null> {
    if (typeof window === 'undefined' || !navigator.geolocation) {
        console.warn('Geolocalización no soportada en este navegador.');
        return null;
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                console.warn('Error obteniendo geolocalización:', error.message);
                resolve(null);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    });
}

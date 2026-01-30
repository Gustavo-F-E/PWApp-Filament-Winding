// src/utils/validation.ts

/**
 * Verifica si un valor contiene una coma como separador decimal.
 * @param value El string a verificar.
 * @returns true si contiene una coma, false de lo contrario.
 */
export const hasCommaSeparator = (value: string): boolean => {
    return value.includes(",");
};

/**
 * Mensaje de error estándar para separador decimal incorrecto.
 */
export const DECIMAL_SEPARATOR_ERROR = 'El separador decimal es el símbolo "."';

/**
 * Maneja el evento de cambio en un input numérico para validar el separador decimal.
 * @param e Evento de cambio de React.
 * @param onError Función a llamar cuando se detecta una coma.
 */
export const handleNumericChangeValidation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onError: (msg: string) => void
) => {
    if (hasCommaSeparator(e.target.value)) {
        onError(DECIMAL_SEPARATOR_ERROR);
    }
};

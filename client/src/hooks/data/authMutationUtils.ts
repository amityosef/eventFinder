import { AxiosError } from 'axios';

interface ErrorPayload {
    message?: string | string[];
}

export const getApiErrorMessage = (
    error: unknown,
    fallbackMessage: string,
): string => {
    if (error instanceof AxiosError) {
        const payload = error.response?.data as ErrorPayload | undefined;
        const apiMessage = payload?.message;

        if (Array.isArray(apiMessage) && apiMessage.length > 0) {
            return apiMessage[0];
        }

        if (typeof apiMessage === 'string' && apiMessage.length > 0) {
            return apiMessage;
        }
    }

    return fallbackMessage;
};

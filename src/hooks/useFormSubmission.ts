'use client';

import { useState, useCallback } from 'react';
import { useUI } from '@/contexts/UIContext';

interface UseFormSubmissionOptions {
    onSuccess?: (result: any) => void;
    onError?: (error: Error) => void;
    successMessage?: string;
    errorMessage?: string;
}

export function useFormSubmission<T = any>(options: UseFormSubmissionOptions = {}) {
    const { showToast, setSubmitting } = useUI();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = useCallback(async (submitFn: () => Promise<T>): Promise<T | null> => {
        if (isLoading) {
            return null; // Prevent double submission
        }

        setIsLoading(true);
        setSubmitting(true);
        setError(null);

        try {
            const result = await submitFn();

            if (options.successMessage) {
                showToast('success', options.successMessage);
            }

            if (options.onSuccess) {
                options.onSuccess(result);
            }

            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('An unexpected error occurred');
            setError(error.message);

            const errorMessage = options.errorMessage || error.message;
            showToast('error', 'Error', errorMessage);

            if (options.onError) {
                options.onError(error);
            }

            return null;
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    }, [isLoading, setSubmitting, showToast, options]);

    return {
        submit,
        isLoading,
        error,
        clearError: () => setError(null),
    };
}
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, ToastType } from '@/components/Toast';

interface UIContextType {
    // Loading state
    isGlobalLoading: boolean;
    setGlobalLoading: (loading: boolean) => void;

    // Toast management
    toasts: Toast[];
    showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
    dismissToast: (id: string) => void;

    // Form submission protection
    isSubmitting: boolean;
    setSubmitting: (submitting: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
    children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
    const [isGlobalLoading, setIsGlobalLoading] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setGlobalLoading = (loading: boolean) => {
        setIsGlobalLoading(loading);
    };

    const showToast = (type: ToastType, title: string, message?: string, duration?: number) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = {
            id,
            type,
            title,
            message,
            duration,
        };

        setToasts(prev => [...prev, newToast]);
    };

    const dismissToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const setSubmitting = (submitting: boolean) => {
        setIsSubmitting(submitting);
    };

    const contextValue: UIContextType = {
        isGlobalLoading,
        setGlobalLoading,
        toasts,
        showToast,
        dismissToast,
        isSubmitting,
        setSubmitting,
    };

    return (
        <UIContext.Provider value={contextValue}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI(): UIContextType {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
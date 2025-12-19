'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastItemProps {
    toast: Toast;
    onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation
        setIsVisible(true);

        // Auto dismiss
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onDismiss(toast.id), 300); // Wait for animation
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onDismiss]);

    const typeConfig = {
        success: {
            icon: CheckCircleSolidIcon,
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-800',
            iconColor: 'text-green-500 dark:text-green-400',
            titleColor: 'text-green-800 dark:text-green-200',
            messageColor: 'text-green-700 dark:text-green-300',
            ringColor: 'ring-green-500/20',
        },
        error: {
            icon: ExclamationTriangleIcon,
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-200 dark:border-red-800',
            iconColor: 'text-red-500 dark:text-red-400',
            titleColor: 'text-red-800 dark:text-red-200',
            messageColor: 'text-red-700 dark:text-red-300',
            ringColor: 'ring-red-500/20',
        },
        warning: {
            icon: ExclamationTriangleIcon,
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            borderColor: 'border-yellow-200 dark:border-yellow-800',
            iconColor: 'text-yellow-500 dark:text-yellow-400',
            titleColor: 'text-yellow-800 dark:text-yellow-200',
            messageColor: 'text-yellow-700 dark:text-yellow-300',
            ringColor: 'ring-yellow-500/20',
        },
        info: {
            icon: InformationCircleIcon,
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
            iconColor: 'text-blue-500 dark:text-blue-400',
            titleColor: 'text-blue-800 dark:text-blue-200',
            messageColor: 'text-blue-700 dark:text-blue-300',
            ringColor: 'ring-blue-500/20',
        },
    };

    const config = typeConfig[toast.type];
    const Icon = config.icon;

    return (
        <div
            className={`transform transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
        >
            <div className={`max-w-sm w-full ${config.bgColor} ${config.borderColor} border shadow-lg rounded-lg pointer-events-auto ring-1 ${config.ringColor} overflow-hidden backdrop-blur-sm`}>
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <Icon className={`h-6 w-6 ${config.iconColor}`} aria-hidden="true" />
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className={`text-sm font-semibold ${config.titleColor}`}>
                                {toast.title}
                            </p>
                            {toast.message && (
                                <p className={`mt-1 text-sm ${config.messageColor}`}>
                                    {toast.message}
                                </p>
                            )}
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                className={`${config.bgColor} rounded-md inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors`}
                                onClick={() => {
                                    setIsVisible(false);
                                    setTimeout(() => onDismiss(toast.id), 300);
                                }}
                                aria-label="Close notification"
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div 
            className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none max-w-sm w-full"
            role="region"
            aria-label="Notifications"
            aria-live="polite"
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    );
}
'use client';

import { UIProvider, useUI } from '@/contexts/UIContext';
import { ToastContainer } from '@/components/Toast';
import { GlobalLoadingOverlay } from '@/components/LoadingSpinner';
import { ReactNode } from 'react';

function UIWrapperContent({ children }: { children: ReactNode }) {
    const { isGlobalLoading, toasts, dismissToast } = useUI();

    return (
        <>
            {children}
            <GlobalLoadingOverlay isVisible={isGlobalLoading} />
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </>
    );
}

export function UIWrapper({ children }: { children: ReactNode }) {
    return (
        <UIProvider>
            <UIWrapperContent>{children}</UIWrapperContent>
        </UIProvider>
    );
}


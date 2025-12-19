'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Log error to external service (if configured)
        this.logErrorToService(error, errorInfo);

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Update state with error info
        this.setState({
            error,
            errorInfo,
        });
    }

    private logErrorToService(error: Error, errorInfo: ErrorInfo) {
        // In production, you would send this to an error tracking service
        // Example: Sentry, LogRocket, etc.
        if (process.env.NODE_ENV === 'production') {
            // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
            console.error('Production error:', {
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
            });
        }
    }

    private handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    private handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                                <svg
                                    className="h-6 w-6 text-red-600 dark:text-red-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Something went wrong
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                We're sorry, but something unexpected happened. Please try again or reload the page.
                            </p>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-left">
                                    <p className="text-sm font-mono text-red-600 dark:text-red-400 mb-2">
                                        {this.state.error.toString()}
                                    </p>
                                    {this.state.error.stack && (
                                        <details className="text-xs text-gray-600 dark:text-gray-300">
                                            <summary className="cursor-pointer mb-2">Stack Trace</summary>
                                            <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                                                {this.state.error.stack}
                                            </pre>
                                        </details>
                                    )}
                                    {this.state.errorInfo && (
                                        <details className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                                            <summary className="cursor-pointer mb-2">Component Stack</summary>
                                            <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={this.handleReset}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    aria-label="Try again"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={this.handleReload}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    aria-label="Reload page"
                                >
                                    Reload Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Hook to manually trigger error boundary
 * Useful for testing or handling async errors
 */
export function useErrorHandler() {
    return (error: Error, errorInfo?: ErrorInfo) => {
        // This will be caught by the nearest ErrorBoundary
        throw error;
    };
}


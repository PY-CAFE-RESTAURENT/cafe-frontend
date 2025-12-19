interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    return (
        <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-amber-600 ${sizeClasses[size]} ${className}`} />
    );
}

export function GlobalLoadingOverlay({ isVisible }: { isVisible: boolean }) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4 shadow-xl">
                <LoadingSpinner size="lg" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">Loading...</p>
            </div>
        </div>
    );
}
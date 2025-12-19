import { OrderStatus } from '@/types';

/**
 * Get display label for order status
 * Maps backend status to user-friendly labels for self-service cafe
 */
export function getOrderStatusLabel(status: OrderStatus): string {
    switch (status) {
        case 'pending':
            return 'Preparing';
        case 'completed':
            return 'Ready for Collection';
        case 'cancelled':
            return 'Cancelled';
        default:
            return status.charAt(0).toUpperCase() + status.slice(1);
    }
}

/**
 * Get status color classes for UI
 */
export function getOrderStatusColor(status: OrderStatus): string {
    switch (status) {
        case 'pending':
            return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
        case 'completed':
            return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
        case 'cancelled':
            return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
        default:
            return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
}


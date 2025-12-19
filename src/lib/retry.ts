/**
 * Retry utility for handling failed operations with exponential backoff
 */

export interface RetryOptions {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    retryable?: (error: any) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
    maxAttempts: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
    backoffMultiplier: 2,
    retryable: () => true,
};

/**
 * Sleep utility for delays
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retries an async operation with exponential backoff
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns Promise that resolves with the function result or rejects after max attempts
 */
export async function retry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const config = { ...DEFAULT_OPTIONS, ...options };
    let lastError: any;
    let delay = config.initialDelay;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Check if error is retryable
            if (!config.retryable(error)) {
                throw error;
            }

            // Don't wait after the last attempt
            if (attempt < config.maxAttempts) {
                // Calculate delay with exponential backoff
                const currentDelay = Math.min(delay, config.maxDelay);
                console.warn(
                    `Attempt ${attempt} failed, retrying in ${currentDelay}ms...`,
                    error
                );
                await sleep(currentDelay);
                delay *= config.backoffMultiplier;
            }
        }
    }

    // All attempts failed
    throw lastError;
}

/**
 * Checks if an error is a network error (retryable)
 */
export function isNetworkError(error: any): boolean {
    if (!error) return false;
    
    // Check for network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
        return true;
    }
    
    // Check for timeout errors
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
        return true;
    }
    
    // Check for connection errors
    if (error.message?.includes('Failed to fetch') || 
        error.message?.includes('NetworkError') ||
        error.message?.includes('Network request failed')) {
        return true;
    }
    
    return false;
}

/**
 * Checks if an HTTP error is retryable (5xx errors)
 */
export function isRetryableHttpError(error: any): boolean {
    if (!error) return false;
    
    // Check if it's an ApiError with retryable status code
    if (error.status && error.status >= 500 && error.status < 600) {
        return true;
    }
    
    // Check for rate limiting (429)
    if (error.status === 429) {
        return true;
    }
    
    return false;
}

/**
 * Checks if an error is retryable (network errors or 5xx HTTP errors)
 */
export function isRetryableError(error: any): boolean {
    return isNetworkError(error) || isRetryableHttpError(error);
}


/**
 * Session Management Utilities
 * 
 * Provides functions for managing user sessions including:
 * - UUID-based session ID generation
 * - localStorage operations for session persistence
 * - Session validation and recovery logic
 */

export interface SessionData {
    sessionId: string;
    createdAt: string;
    lastActivity: string;
}

const SESSION_STORAGE_KEY = 'cafe_session';

/**
 * Generates a UUID v4 session ID
 * @returns A unique session identifier string
 */
export function generateSessionId(): string {
    // Generate UUID v4 using crypto.randomUUID if available, fallback to manual generation
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    // Fallback UUID v4 generation for environments without crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Creates a new session with current timestamp
 * @returns SessionData object with new session ID and timestamps
 */
export function createNewSession(): SessionData {
    const now = new Date().toISOString();
    return {
        sessionId: generateSessionId(),
        createdAt: now,
        lastActivity: now
    };
}

/**
 * Stores session data in localStorage
 * @param sessionData - The session data to store
 * @returns boolean indicating success/failure
 */
export function storeSession(sessionData: SessionData): boolean {
    try {
        if (typeof window === 'undefined' || !window.localStorage) {
            return false;
        }

        const serializedData = JSON.stringify(sessionData);
        window.localStorage.setItem(SESSION_STORAGE_KEY, serializedData);
        return true;
    } catch (error) {
        console.error('Failed to store session data:', error);
        return false;
    }
}

/**
 * Retrieves session data from localStorage
 * @returns SessionData if found and valid, null otherwise
 */
export function getStoredSession(): SessionData | null {
    try {
        if (typeof window === 'undefined' || !window.localStorage) {
            return null;
        }

        const storedData = window.localStorage.getItem(SESSION_STORAGE_KEY);
        if (!storedData) {
            return null;
        }

        const sessionData = JSON.parse(storedData) as SessionData;
        return validateSessionData(sessionData) ? sessionData : null;
    } catch (error) {
        console.error('Failed to retrieve session data:', error);
        return null;
    }
}

/**
 * Updates the last activity timestamp for the current session
 * @param sessionData - The session data to update
 * @returns Updated SessionData with new lastActivity timestamp
 */
export function updateSessionActivity(sessionData: SessionData): SessionData {
    const updatedSession = {
        ...sessionData,
        lastActivity: new Date().toISOString()
    };

    storeSession(updatedSession);
    return updatedSession;
}

/**
 * Validates session data structure and content
 * @param sessionData - The session data to validate
 * @returns boolean indicating if session data is valid
 */
export function validateSessionData(sessionData: any): sessionData is SessionData {
    if (!sessionData || typeof sessionData !== 'object') {
        return false;
    }

    const { sessionId, createdAt, lastActivity } = sessionData;

    // Check required fields exist and are strings
    if (!sessionId || typeof sessionId !== 'string' ||
        !createdAt || typeof createdAt !== 'string' ||
        !lastActivity || typeof lastActivity !== 'string') {
        return false;
    }

    // Validate UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionId)) {
        return false;
    }

    // Validate ISO date strings
    const createdDate = new Date(createdAt);
    const lastActivityDate = new Date(lastActivity);

    if (isNaN(createdDate.getTime()) || isNaN(lastActivityDate.getTime())) {
        return false;
    }

    // Ensure lastActivity is not before createdAt
    if (lastActivityDate < createdDate) {
        return false;
    }

    return true;
}

/**
 * Gets or creates a session, handling recovery from invalid/missing sessions
 * @returns SessionData - either retrieved from storage or newly created
 */
export function getOrCreateSession(): SessionData {
    const existingSession = getStoredSession();

    if (existingSession) {
        // Update activity timestamp and return existing session
        return updateSessionActivity(existingSession);
    }

    // Create new session if none exists or existing is invalid
    const newSession = createNewSession();
    storeSession(newSession);
    return newSession;
}

/**
 * Clears session data from localStorage
 * @returns boolean indicating success/failure
 */
export function clearSession(): boolean {
    try {
        if (typeof window === 'undefined' || !window.localStorage) {
            return false;
        }

        window.localStorage.removeItem(SESSION_STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Failed to clear session data:', error);
        return false;
    }
}

/**
 * Checks if a session is expired based on inactivity
 * @param sessionData - The session data to check
 * @param maxInactiveHours - Maximum hours of inactivity before expiration (default: 24)
 * @returns boolean indicating if session is expired
 */
export function isSessionExpired(sessionData: SessionData, maxInactiveHours: number = 24): boolean {
    const lastActivity = new Date(sessionData.lastActivity);
    const now = new Date();
    const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

    return hoursSinceActivity > maxInactiveHours;
}

/**
 * Gets current session ID, creating a new session if needed
 * @returns string - the current session ID
 */
export function getCurrentSessionId(): string {
    const session = getOrCreateSession();
    return session.sessionId;
}

/**
 * Recovers session from invalid or missing state
 * Creates a new session if current one is invalid or expired
 * @param maxInactiveHours - Maximum hours of inactivity before expiration (default: 24)
 * @returns SessionData - recovered or newly created session
 */
export function recoverSession(maxInactiveHours: number = 24): SessionData {
    try {
        const existingSession = getStoredSession();
        
        if (existingSession) {
            // Check if session is expired
            if (isSessionExpired(existingSession, maxInactiveHours)) {
                console.warn('Session expired, creating new session');
                clearSession();
                const newSession = createNewSession();
                storeSession(newSession);
                return newSession;
            }
            
            // Update activity and return existing session
            return updateSessionActivity(existingSession);
        }
        
        // No session found, create new one
        const newSession = createNewSession();
        storeSession(newSession);
        return newSession;
    } catch (error) {
        console.error('Error recovering session:', error);
        // Fallback: create new session
        const newSession = createNewSession();
        storeSession(newSession);
        return newSession;
    }
}

/**
 * Validates and recovers session if needed
 * @returns SessionData - valid session
 */
export function ensureValidSession(): SessionData {
    return recoverSession();
}
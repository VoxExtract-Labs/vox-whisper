// src/WhisperError.ts

/**
 * Custom error class for Whisper-related errors.
 */
export class WhisperError extends Error {
    public originalError?: Error;

    /**
     * Creates an instance of WhisperError.
     * @param message - The error message.
     * @param originalError - The original error that was caught.
     */
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'WhisperError';
        this.originalError = originalError;
    }
}

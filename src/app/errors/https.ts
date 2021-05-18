import { HttpsError as FirebaseHttpsError } from 'firebase-functions/lib/providers/https';
import { ErrorCode } from './codes';

/**
 * Https Error Exception class
 * It extends the Firebase function HttpsError
 */
export class HttpsError extends FirebaseHttpsError {
    constructor(code: ErrorCode, message: string) {
        super(code, message);
    }
}

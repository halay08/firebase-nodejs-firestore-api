import * as functions from 'firebase-functions';

export function functionLog(msg: any) {
    functions.logger.info(msg, { structuredData: true });
}

import * as functions from 'firebase-functions';

const env = functions.config().env.region || process.env;
const region = functions.config().env.region || process.env.REGION;
const timezone = functions.config().env.timezone || process.env.TIMEZONE;
const runtimeOptions = functions.config().env.runtimeOptions || JSON.parse(process.env.RUNTIME_OPTIONS || '{}');

export { env, region, timezone, runtimeOptions };

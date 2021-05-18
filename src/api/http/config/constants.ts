import * as functions from 'firebase-functions';

const apiVersion = functions.config().env.api.version;

const env = functions.config().env;

const {
    maxQueueItemsSubmit: MAX_QUEUE_ITEMS_SUBMIT = process.env.MAX_QUEUE_ITEMS_SUBMIT,
    defaultLearningQueueLimit: DEFAULT_LEARNING_QUEUE_LIMIT = process.env.DEFAULT_LEARNING_QUEUE_LIMIT,
    defaultRecentChallengesLimit: DEFAULT_RECENT_CHALLENGES_LIMIT = process.env.DEFAULT_RECENT_CHALLENGES_LIMIT
} = functions.config().env.learningQueue;

export { env, apiVersion, MAX_QUEUE_ITEMS_SUBMIT, DEFAULT_LEARNING_QUEUE_LIMIT, DEFAULT_RECENT_CHALLENGES_LIMIT };

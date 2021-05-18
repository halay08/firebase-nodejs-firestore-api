require('dotenv').config();

import './firebase.config';

import TYPES from './types';
import * as functions from 'firebase-functions';
import Container from './container';
import { IServer } from '@/api/http/server';
import { region } from '@/app/functions/configs/runtime';

// Rest API
try {
    const server = Container.get<IServer>(TYPES.Server);
    exports.api = functions.region(region).https.onRequest(server.start());
} catch (e) {
    if (e instanceof Error) console.log(e.message);
    else throw e;
}

export * from '@/app/functions';

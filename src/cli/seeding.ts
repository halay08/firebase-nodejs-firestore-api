#!/usr/bin/env node

// eslint-disable-next-line import/no-unassigned-import
import 'module-alias/register';

require('dotenv').config();

// eslint-disable-next-line import/no-unassigned-import
import '../firebase.config';

import Container from '../container';
import TYPES from '@/src/types';
import { ISeeding } from '@/src/infra/database/migration';

type ISeedingType = 'UserSeeding';

class Seeding {
    #seedings: ISeedingType[] = ['UserSeeding'];

    async runSingle(specifiedSeeding: ISeedingType) {
        if (specifiedSeeding) {
            const instance = Container.get<ISeeding>(TYPES[specifiedSeeding]);
            await instance.run();
        }
    }

    async run(specifiedSeeding?: ISeedingType) {
        if (specifiedSeeding) {
            if (!this.#seedings.includes(specifiedSeeding)) {
                throw new Error(
                    `Couldn't run seeding ${specifiedSeeding} via CLI. Please use firebase functions:shell instead.`
                );
            }
            return await this.runSingle(specifiedSeeding);
        }

        for (const seeding of this.#seedings) {
            await this.runSingle(seeding);
        }
    }
}

export default new Seeding();

#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const program = require('commander');

import seeding from './seeding';

clear();
console.log(chalk.red(figlet.textSync('function-cli', { horizontalLayout: 'full' })));

program
    .version('0.0.1')
    .description('Rappler Community Function CLI')
    .option('-b, --seedall', 'Run all seeding')
    .option('-c, --seed <type>', 'Run seeding by specified type')
    .parse(process.argv);

if (program.seed) {
    const seed = program.seed;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
        await seeding.run(seed);
    })();
} else if (program.seedall) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
        await seeding.run();
    })();
}

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

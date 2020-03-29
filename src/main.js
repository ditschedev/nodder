import { promisify } from 'util';

import fs from 'fs';
import path from 'path';
import mustache from 'mustache';
import chalk from 'chalk';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

// Commands:
import initCommand from './commands/init';

const access = promisify(fs.access);

const init = async function(options) {

    options = {
        ...options,
        targetDirectory: path.resolve(process.cwd(), options.name || 'nodejs-slender'),
        email: 'hello@ditsche.dev',
        author: 'Tobias Dittmann',
    };

    const tasks = new Listr([
        {
            title: '📑 Cloning repository',
            task: () => cloneRepository(options),
        },
        {
            title: '♻️  Install dependencies',
            task: () => projectInstall({ cwd: options.targetDirectory })
        },
    ]);
    await tasks.run();
    console.log('%s Project initiated', chalk.green.bold('DONE'));
    return true;
};

async function cloneRepository(options) {
    let result = await execa('git', ['clone', 'git@github.com:ditschedev/nodejs-slender.git', options.targetDirectory]);
    if (result.failed) {
        return Promise.reject(new Error('Failed to initialize git'));
    }
    result = await execa('git', ['remote', 'remove', 'origin'], {
        cwd: options.targetDirectory,
    });
    if (result.failed) {
        return Promise.reject(new Error('Failed to initialize git'));
    }
    return;
}

const help = function(action) {

};

const create = function(type, name) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
        email: 'hello@ditsche.dev',
        name: 'Tobias Dittmann',
    };

    const currentFileUrl = import.meta.url;
    const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../templates'
    );
    options.templateDirectory = templateDir;

    console.log(templateDir);
};

const remove = function(type, name) {

};


export default {
    init,
    create,
    remove,
    help
};
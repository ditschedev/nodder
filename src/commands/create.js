/** 
 * create command
 * 
 * Creates a model, controller or middleware in the current
 * project. must be executed in the root of the project.
 */

import Mustache from 'mustache';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import execa from 'execa';
import Listr from 'listr';

const typesMap = {
    'model': createModel,
    'controller': createController,
    'middleware': createMiddleware
}

export default function(options) {
    let actionParts = options.action.split(':');
    options.action = actionParts[0];
    options.type = actionParts[1];
    typesMap[options.type](options);
};

async function createModel(options) {

    options.targetPath = path.resolve(options.workingDirectory, 'app/model/', options.name.toLowerCase() + '.model.js');

    const tasks = new Listr([
        {
            title: '📑 Creating new model named ' + options.name,
            task: () => copyBase(options),
        },
        {
            title: '  Adding model to exports',
            task: () => addToExport(options, options.name)
        }
    ]);
    await tasks.run();
    console.log('%s %s model created', chalk.green.bold('DONE'), options.name);
}

async function createController(options) {

    options.controller = options.name.toLowerCase().replace('controller', '');

    options.targetPath = path.resolve(options.workingDirectory, 'app/controller/', options.controller + '.controller.js');

    const tasks = new Listr([
        {
            title: '📑 Creating new controller named ' + options.name,
            task: () => copyBase(options),
        },
        {
            title: '  Adding controller to exports',
            task: () => addToExport(options, options.name)
        }
    ]);
    await tasks.run();
    console.log('%s %sController created', chalk.green.bold('DONE'), options.name);
}

async function createMiddleware(options) {

    options.targetPath = path.resolve(options.workingDirectory, 'app/middleware/', options.name.toLowerCase() + '.middleware.js');

    const tasks = new Listr([
        {
            title: '📑 Creating new middleware named ' + options.name,
            task: () => copyBase(options),
        },
        {
            title: '  Adding middleware to exports',
            task: () => addToExport(options, options.name)
        }
    ]);
    await tasks.run();
    console.log('%s %s middleware created', chalk.green.bold('DONE'), options.name);
}

function copyBase(options) {
    const template = '../../../templates/' + options.type + '.js';
    const currentFileUrl = import.meta.url;
    const templatePath = path.resolve(new URL(currentFileUrl).pathname, template);
    let raw = fs.readFileSync(templatePath).toString();
    let model = Mustache.render(raw, {
        name: options.name
    });
    fs.writeFileSync(options.targetPath, model);
}

function addToExport(options, name) {
    const indexFile = path.resolve(options.workingDirectory, 'app/', options.type + '/', 'index.js');
    let contents = fs.readFileSync(indexFile);
    let req = "const " + name + " = require('./" + name.toLowerCase() + "." + options.type + "'); \r\n";
    let newContent = req + contents;
    let lines = newContent.split(options.eol);
    lines[lines.length-2] += ',';
    lines[lines.length-1] = '    ' + name;
    lines.push('}');
    fs.writeFileSync(indexFile, lines.join(options.eol));
}
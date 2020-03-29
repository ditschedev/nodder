import arg from 'arg';
import inquirer from 'inquirer';
import path from 'path';
import main from './main';
import os from 'os';

import createCommand from './commands/create';

const actions = {
    'init': main.init,
    help: main.help,
    'create:model': createCommand, 
    'create:controller': createCommand, 
    'create:middleware': createCommand,
    'delete:model': main.delete,
    'delete:controller': main.delete,
    'delete:middleware': main.delete
}

export async function cli(args) {
    let options = parseArgs(args);
    options = await promptAction(options);
    options = {
        ...options,
        workingDirectory: process.cwd(),
        targetDirectory: path.resolve(process.cwd(), options.name || 'nodejs-slender'),
        email: 'hello@ditsche.dev',
        author: 'Tobias Dittmann',
        eol: os.EOL
    };
    await actions[options.action](options);
}

function parseArgs(raw) {
    const args = arg({
        '--help': Boolean,
        '-h': '--help'
    }, {
        argv: raw.slice(2)
    });

    return {
        showHelp: args['--help'] || false,
        action: args._[0],
        name: args._[1]
    };
}

async function promptAction(options) {
    const defaultTemplate = 'help';
    if (options.showHelp || !options.action) {
        return {
            ...options,
            action: defaultTemplate,
        };
    }

    let possibleChoices = Object.keys(actions);

    let questions = [];
    if (!options.action) {
        questions.push({
            type: 'list',
            name: 'action',
            message: 'Please choose an action',
            choices: possibleChoices,
            default: defaultTemplate,
        });
    }
    let answers = await inquirer.prompt(questions);

    let action = options.action || answers.action;
    action = action.toLowerCase();

    if(!possibleChoices.includes(action))
    {
        return {
            ...options,
            showHelp: true,
            action: defaultTemplate,
          };
    }

    questions = [];
    if (!options.name && action != 'help' && action != 'init') {
        questions.push({
            type: 'input',
            name: 'name',
            message: 'Provide the name of the ' + action.split(':')[1] + ':',
            validate(input) {
                return new Promise((resolve, reject) => {
                    if(input.length < 4) reject('Please provide at least 3 letters');
                    return resolve(true);
                });
            }
        });
    }
   
    answers = await inquirer.prompt(questions);
    answers.action = action;
    return {
        ...options,
        action: action,
        name: options.name || answers.name
    };
   }
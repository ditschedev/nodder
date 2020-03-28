import arg from 'arg';
import inquirer from 'inquirer';

export async function cli(args) {
    let options = parseArgs(args);
    options = await promptAction(options);
    console.log(options);
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
    if (options.showHelp) {
      return {
        ...options,
        template: options.template || defaultTemplate,
      };
    }
    let questions = [];
    if (!options.action) {
      questions.push({
        type: 'list',
        name: 'action',
        message: 'Please choose an action',
        choices: [
            'create:model', 
            'create:controller', 
            'create:middleware',
            'delete:model',
            'delete:controller',
            'delete:middleware'
        ],
        default: defaultTemplate,
      });
    }
    let answers = await inquirer.prompt(questions);

    let action = options.action || answers.action;
    action = action.toLowerCase();

    questions = [];
    if (!options.name) {
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
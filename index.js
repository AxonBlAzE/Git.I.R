#!/usr/bin/env node

import { Octokit } from "@octokit/rest";
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function diplayTitle() {
    
    const t = chalkAnimation.rainbow(figlet.textSync('Git.I.R', { horizontalLayout: 'full' }));
    await sleep(2000);
    t.stop();

};

async function askCreate(){
    const answer = await inquirer.prompt([
        {
            name: 'ask_create',
            type: 'list',
            message: 'Do you wish to Create A New GitHub Repository?',
            choices: ['Yes', 'No'],
            default() {
                return 'Yes';
            }
        },
    ]);
    return answer.ask_create;
};

async function askToken(){
    const answer = await inquirer.prompt([
        {
            name: 'ask_token',
            type: 'password',
            mask: '*',
            message: 'Enter your GitHub Personal Access Token:',
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your GitHub Personal Access Token';
                }
            }
        },
    ]);
    return answer.ask_token;
};

async function askRepoName(){
    const answer = await inquirer.prompt([
        {
            name: 'ask_repo_name',
            type: 'input',
            message: 'Enter the name of the repository:',
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter the name of the repository';
                }
            }
        },
    ]);
    return answer.ask_repo_name;
};

async function askDescripionYesNo(){
    const answer = await inquirer.prompt([
        {
            name: 'ask_description',
            type: 'list',
            message: 'Do you wish to add a description to the repository?',
            choices: ['Yes', 'No'],
            default() {
                return 'Yes';
            }
        },
    ]);
    return answer.ask_description;
};

async function askRepoDescription(){
    const answer = await inquirer.prompt([
        {
            name: 'ask_repo_description',
            type: 'input',
            message: 'Enter the description of the repository:',
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter the description of the repository';
                }
            }
        },
    ]);
    return answer.ask_repo_description;
}

async function askVisibility(){
    const answer = await inquirer.prompt([
        {
            name: 'ask_visibility',
            type: 'list',
            message: 'Decide the visibility of the repository:',
            choices: ['Public', 'Private'],
            default() {
                return 'Public';
            }
        },
    ]);
    return answer.ask_visibility;
}

async function askClone(){
    const answer = await inquirer.prompt([
        {
            name: 'ask_clone',
            type: 'list',
            message: 'Do you wish to Clone the repository?',
            choices: ['Yes', 'No'],
            default() {
                return 'Yes';
            }
        },
    ]);
    return answer.ask_clone;
}

async function createRepo(token, repo_name, repo_description, isPrivate){
    const clientWithAuth = new Octokit({
        auth: "token " + token
    });
    clientWithAuth.repos.createForAuthenticatedUser({
        name: repo_name,
        description: repo_description,
        private: isPrivate,
    }).then(async function(response) {
        // console.log(response);
        const spinner = createSpinner("Creating Repository...").start();
        await sleep(2000);
        spinner.color = 'yellow';
        spinner.stop();
        if (response.status === 201) {
            const clone_url = response.data.clone_url;
            console.log(chalk.green(`Successfully created repository ${repo_name} at ${clone_url}`));
            return clone_url;
        } else {
            console.log(chalk.red(`Error creating repository ${repo_name}`));
        }
    });
}

async function main(){
    await diplayTitle();
    const ask_create = await askCreate();
    if (ask_create === 'No' ){
        process.exit(1)
    } 
    const ask_token = await askToken();
    const ask_repo_name = await askRepoName();
    const ask_description = await askDescripionYesNo();
    const ask_repo_description = '';
    if (ask_description === 'Yes'){
        const ask_repo_description = await askRepoDescription();
    } 
    const ask_visibility = await askVisibility();
    const clone_url = createRepo(ask_token, ask_repo_name, ask_repo_description, ask_visibility);
    // const ask_clone = await askClone();
    // if (ask_clone === 'Yes'){
    //     console.log(chalk.green(`Cloning repository ${ask_repo_name} at ${clone_url}`));
    //     const spinner = createSpinner("Cloning Repository...").start();
    //     await sleep(2000);
    //     spinner.color = 'yellow';
    //     spinner.stop();
    // }
}

await main();





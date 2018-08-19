#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { appendRandomTags } = require('./utils');
const config = require('./config');
const instaAutomation = require('./instaAutomation');
const { retrieveRedditPost } = require('./reddit-scraper');
program
    .version('1.0.0', '-v --version')
    .option('-u, --username [value]', 'Set instagram account username')
    .option('-p, --password [value]', 'Set instagram account password')
    .option('--show', 'sets instaAutomation to run with a browser')
    .parse(process.argv);
(() => __awaiter(this, void 0, void 0, function* () {
    /* if no password, request password */
    if (program.username && !program.password) {
        const { password } = yield inquirer.prompt({
            type: 'password',
            name: 'password',
            message: 'password:',
        });
        program.password = password;
    }
    if (!program.username || !program.password) {
        console.error(chalk.red('ERROR:') + ' must specify username and password (-h for help)');
        process.exit(1);
    }
    const credentials = {
        username: program.username,
        password: program.password,
    };
    const REPOST_OPTION = `repost post from r/${config.subreddit} subreddit`;
    const CUSTOM_POST_OPTION = 'create custom post';
    const FOLLOW_OPTION = 'follow all from suggested';
    const EXIT_OPTION = 'exit';
    const cliMenuChoices = {
        type: 'list',
        name: 'command',
        message: 'pick an action',
        choices: [
            REPOST_OPTION,
            CUSTOM_POST_OPTION,
            FOLLOW_OPTION,
            EXIT_OPTION,
        ],
    };
    try {
        console.log('attempting log in...');
        const session = yield instaAutomation.createSession(!!program.show);
        yield instaAutomation.login(session, credentials);
        console.log('successfully logged in');
        while (true) {
            const { command } = yield inquirer.prompt(cliMenuChoices);
            if (command === REPOST_OPTION) {
                const redditPost = yield retrieveRedditPost();
                redditPost.topComment = appendRandomTags(redditPost.topComment);
                const post = { imageUrl: redditPost.imageUrl, caption: redditPost.topComment };
                console.log(post);
                console.log('posting successful');
                yield instaAutomation.post(session, post);
                console.log('posting successful');
            }
            else if (command === CUSTOM_POST_OPTION) {
                const { imageUrl } = yield inquirer.prompt({
                    type: 'input',
                    name: 'imageUrl',
                    message: 'input url of image to use:',
                });
                const { caption } = yield inquirer.prompt({
                    type: 'input',
                    name: 'caption',
                    message: 'input caption:',
                });
                const post = { imageUrl, caption };
                console.log('posting...');
                yield instaAutomation.post(session, post);
                console.log('posting successful');
            }
            else if (command === FOLLOW_OPTION) {
                const suggestedCount = yield instaAutomation.followAll(session);
                console.log(`followed top ${suggestedCount} suggested users`);
            }
            else {
                console.log('instabot exited');
                process.exit(1);
            }
        }
    }
    catch (error) {
        throw error;
    }
}))();

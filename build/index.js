#!/usr/bin/env ts-node
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
if (!program.username || !program.password) {
    console.error(chalk.red('ERROR:') + ' must specify username and password (-h for help)');
    process.exit(1);
}
const credentials = {
    username: program.username,
    password: program.password,
};
const REPOST_OPTION = 'repost post from Reddit';
const FOLLOW_OPTION = 'follow all from suggested';
const EXIT_OPTION = 'exit';
const cliMenuChoices = {
    type: 'list',
    name: 'command',
    message: 'pick an action',
    choices: [
        REPOST_OPTION,
        FOLLOW_OPTION,
        EXIT_OPTION,
    ],
};
(() => __awaiter(this, void 0, void 0, function* () {
    try {
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
                yield instaAutomation.post(session, post);
            }
            else if (command === FOLLOW_OPTION) {
                const suggestedCount = yield instaAutomation.followAll(session);
                console.log(`followed all ${suggestedCount} suggested users`);
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

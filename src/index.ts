#!/usr/bin/env ts-node

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

  const REPOST_OPTION :string = 'repost post from Reddit';
  const FOLLOW_OPTION :string = 'follow all from suggested';
  const EXIT_OPTION :string = 'exit';

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

  (async () => {

    try {
      const session = await instaAutomation.createSession(!!program.show);
      await instaAutomation.login(session, credentials);

      console.log('successfully logged in');

      while(true) {
        const { command } = await inquirer.prompt(cliMenuChoices);

        if (command === REPOST_OPTION) {
          const redditPost = await retrieveRedditPost();
          redditPost.topComment = appendRandomTags(redditPost.topComment);

          const post = { imageUrl: redditPost.imageUrl, caption: redditPost.topComment };

          console.log(post);

          await instaAutomation.post(session, post);


        } else if (command === FOLLOW_OPTION) {
          const suggestedCount = await instaAutomation.followAll(session);
          console.log(`followed all ${suggestedCount} suggested users`);

        } else {
          console.log('instabot exited');
          process.exit(1);

        }

      }

    } catch(error) {
      throw error;
    }

  })();
#!/usr/bin/env node

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

  (async () => {

    /* if no password, request password */
    if (program.username && !program.password) {
      const { password } = await inquirer.prompt({
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

    const REPOST_OPTION :string = `repost post from r/${config.subreddit} subreddit`;
    const CUSTOM_POST_OPTION :string = 'create custom post';
    const FOLLOW_OPTION :string = 'follow all from suggested';
    const EXIT_OPTION :string = 'exit';

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

        } else if (command === CUSTOM_POST_OPTION) {
          const { imageUrl } = await inquirer.prompt({
            type: 'input',
            name: 'imageUrl',
            message: 'input url of image to use:',
          });

          const { caption } = await inquirer.prompt({
            type: 'input',
            name: 'caption',
            message: 'input caption:',
          });

          const post = { imageUrl, caption };

          console.log('posting...');

          await instaAutomation.post(session, post);

          console.log('posting successful');

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
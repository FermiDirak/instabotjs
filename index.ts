#!/usr/bin/env ts-node

const chalk = require('chalk');
const program = require('commander');

const { appendRandomTags, saveImage, squareImage } = require('./utils');
const config = require('./config');

const instaAutomation = require('./instaAutomation');
const { retrieveRedditPost } = require('./reddit-scraper');

program
  .version('1.0.0', '-v --version')
  .option('-u, --username [value]', 'Set instagram account username')
  .option('-p, --password [value]', 'Set instagram account password')
  .parse(process.argv);

  if (!program.username || !program.password) {
    console.error(chalk.red('ERROR:') + ' must specify username and password (-h for help)');
    process.exit(1);
  }

// /** main */
// (async () => {
//   try {

//     const session = await instaAutomation.createSession();
//     await instaAutomation.login(session);

//     while (true) {
//       const redditPost = await retrieveRedditPost();
//       redditPost.topComment = appendRandomTags(redditPost.topComment);
//       const fileName = await saveImage(redditPost.imageUrl);

//       await squareImage(fileName);
//       const imagePath = __dirname + '/postimage.png';

//       console.log(redditPost);

//       await instaAutomation.post(session, {imagePath, caption: redditPost.topComment });
//       await instaAutomation.followAll(session);
//     }

//   } catch (error) {
//     console.error(error);
//   }
// })();

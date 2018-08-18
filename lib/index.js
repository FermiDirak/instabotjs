#!/usr/bin/env ts-node
"use strict";
const { appendRandomTags, saveImage, squareImage } = require('./utils');
const config = require('./config');
const program = require('commander');
const instaAutomation = require('./instaAutomation');
const { retrieveRedditPost } = require('./reddit-scraper');
program
    .version('1.0.0', '-v --version')
    .option('-p, --peppers', 'Add peppers')
    .option('-P, --pineapple', 'Add pineapple')
    .option('-b, --bbq-sauce', 'Add bbq sauce')
    .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);
console.log('you ordered a pizza with:');
if (program.peppers)
    console.log('  - peppers');
if (program.pineapple)
    console.log('  - pineapple');
if (program.bbqSauce)
    console.log('  - bbq');
console.log('  - %s cheese', program.cheese);
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

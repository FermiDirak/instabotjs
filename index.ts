const { appendRandomTags, saveImage, squareImage } = require('./utils');
const config = require('./config');
const program = require('commander');

const instaAutomation = require('./instaAutomation');
const { retrieveRedditPost } = require('./reddit-scraper');

// program
//   .version('1.0.0')
//   .parse(process.argv);

/** main */
(async () => {
  try {

    const session = await instaAutomation.createSession();
    await instaAutomation.login(session);

    while (true) {
      const redditPost = await retrieveRedditPost();
      redditPost.topComment = appendRandomTags(redditPost.topComment);
      const fileName = await saveImage(redditPost.imageUrl);

      await squareImage(fileName);
      const imagePath = __dirname + '/postimage.png';

      console.log(redditPost);

      await instaAutomation.post(session, {imagePath, caption: redditPost.topComment });
      await instaAutomation.followAll(session);
    }

  } catch (error) {
    console.error(error);
  }
})();

const { appendRandomTags, saveImage, squareImage } = require('./utils');
const config = require('./config');

const instaAutomation = require('./instaAutomation');
const { retrieveRedditPost } = require('./reddit-scraper');

/** main */
(async () => {
  try {
    const redditPost = await retrieveRedditPost();
    redditPost.topComment = appendRandomTags(redditPost.topComment);
    const fileName = await saveImage(redditPost.imageUrl);

    await squareImage(fileName);
    const imagePath = __dirname + '/postimage.png';

    console.log(redditPost);

    const session = await instaAutomation.createSession();
    await instaAutomation.login(session);

    while (true) {
      await instaAutomation.post(session, {imagePath, caption: redditPost.topComment });
      await instaAutomation.followAll(session);
    }

  } catch (error) {
    console.error(error);
  }
})();

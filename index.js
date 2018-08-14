const puppeteer = require('puppeteer');

const config = require('./config');
const credentials = require('./credetials');
const { appendRandomTags, saveImage, squareImage } = require('./utils');

const { retrieveRedditPost } = require('./reddit-scraper');

const USERNAME_SELECTOR = '[name="username"]';
const PASSWORD_SELECTOR = '[name="password"]';
const LOGIN_SELECTOR = 'form > span > button';

const NOTNOW_SELECTOR = '[href="/"]';

const NEWPOST_SELECTOR = `[aria-label="New Post"]`;
const IMAGE_UPLOAD_SELECTOR = '[accept="image/jpeg"]';

const GUIDE_LINE_SELECTOR = `[style="right: 33%; top: 0%; width: 1px; height: 100%;"]`;
const HEADER_BUTTONS_SELECTOR = `header > div > div > button`;

const CAPTION_SELECTOR = '[aria-label="Write a caption…"]';

(async () => {
  try {
    const redditPost = await retrieveRedditPost();
    redditPost.topComment = appendRandomTags(redditPost.topComment);
    const fileName = await saveImage(redditPost.imageUrl);

    await squareImage(fileName);
    const imagePath = __dirname + '/postimage.png';

    await simulateBrowser({imagePath, caption: redditPost.topComment });

  } catch (error) {
    console.error(error);
  }
})();

async function simulateBrowser({ imagePath, caption }) {
  try {
    const browser = await puppeteer.launch({ headless: false, slowMo: 20 });
    const page = await browser.newPage();
    page.setUserAgent(config.userAgent);

    /* go to login page */
    await page.goto('https://www.instagram.com/accounts/login/');

    /* authenticate with username, password */
    await page.waitFor(USERNAME_SELECTOR);
    await page.waitFor(PASSWORD_SELECTOR);

    await page.tap(USERNAME_SELECTOR);
    await page.keyboard.type(credentials.username);

    await page.tap(PASSWORD_SELECTOR);
    await page.keyboard.type(credentials.password);

    await page.tap(LOGIN_SELECTOR);

    /* dismiss prompt to remember user */
    await page.waitFor(NOTNOW_SELECTOR);
    await page.tap(NOTNOW_SELECTOR);

    /* post image */
    await page.waitFor(NEWPOST_SELECTOR);

    await page.tap(NEWPOST_SELECTOR);

    const fileUploadInputs = await page.$$(IMAGE_UPLOAD_SELECTOR);

    for (let i = 0; i < fileUploadInputs.length; ++i) {
      let fileUploadInput = fileUploadInputs[i];

      await fileUploadInput.uploadFile(imagePath);
    }

    /* confirm image editing */
    await page.waitFor(GUIDE_LINE_SELECTOR);
    let headerButtons = await page.$$(HEADER_BUTTONS_SELECTOR);
    await headerButtons[1].tap();

    /* adding comment */
    await page.waitFor(CAPTION_SELECTOR);
    await page.tap(CAPTION_SELECTOR);
    await page.keyboard.type(caption);

    headerButtons = await page.$$(HEADER_BUTTONS_SELECTOR);
    await headerButtons[1].tap();

    // await browser.close();

  } catch (error) {
    throw error;
  }
}
const puppeteer = require('puppeteer');

const { retrieveRedditPost } = require('./reddit-scraper');
const { pickRandomTags } = require('./utils');
const config = require('./config');

const USERNAME_SELECTOR = '#faff9bda189814';
const PASSWORD_SELECTOR = '#f8a567a8ca7204';

(async () => {
  try {
    // const redditPost = await retrieveRedditPost();
    // redditPost.topComment += ' ' + pickRandomTags();

    // console.log(redditPost);

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.setUserAgent(config.userAgent);
    // page.setViewport({ isMobile: true });
    await page.goto('https://www.instagram.com/accounts/login/');

    await page.waitFor(`input`);

    await page.click(`input`);
    await page.keyboard.type('hello world');

    // await browser.close();

  } catch (error) {
    console.error(error);
  }


})();
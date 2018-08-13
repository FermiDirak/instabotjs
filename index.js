const puppeteer = require('puppeteer');

const { retrieveRedditPost } = require('./reddit-scraper');
const { pickRandomTags } = require('./utils');
const config = require('./config');

(async () => {
  try {
    // const redditPost = await retrieveRedditPost();
    // redditPost.topComment += ' ' + pickRandomTags();

    // console.log(redditPost);

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.setUserAgent(config.userAgent);
    page.setViewport({ isMobile: true });
    await page.goto('https://www.instagram.com/accounts/login/');

    await page.tap('#f277570152f3454');

    // await browser.close();

  } catch (error) {
    throw error;
  }


})();
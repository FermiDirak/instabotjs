const puppeteer = require('puppeteer');

const { retrieveRedditPost } = require('./reddit-scraper');
const { pickRandomTags } = require('./utils');

(async () => {
  try {
    // const redditPost = await retrieveRedditPost();
    // redditPost.topComment += ' ' + pickRandomTags();

    // console.log(redditPost);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/');
    await page.screenshot({path: 'example.png'});

    await browser.close();

  } catch (error) {
    throw error;
  }


})();
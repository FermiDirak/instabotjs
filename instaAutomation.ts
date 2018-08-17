const puppeteer = require('puppeteer');

const config = require('./config');
const credentials = require('./credentials');

type Page = {
  setUserAgent: Function;
  setViewport: Function;
  goto: Function;
  waitFor: Function;
  tap: Function;
  keyboard: {
    type: Function;
  },
  $: Function,
  $$: Function,
};

type InstagramPost = {
  imagePath: string;
  caption: string;
}

/** creates a puppeteer session */
async function createSession() :Promise<Page> {
  const browser = await puppeteer.launch({ headless: false, slowMo: 20 });
  const page :Page = await browser.newPage();
  page.setUserAgent(config.userAgent);
  page.setViewport({width: 1000, height: 1000});

  return page;
}

/** logs onto instagram
 * @param {Page} page the puppeteer page to act on */
async function login(page :Page) {
  const USERNAME_SELECTOR: string = '[name="username"]';
  const PASSWORD_SELECTOR: string = '[name="password"]';
  const LOGIN_SELECTOR: string = 'form > span > button';
  const NOTNOW_SELECTOR: string = '[href="/"]';

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
}

/** posts content to instagram
 * @param {Page} page The page to act on
 * @param {InstagramPost} the content you want to post to instagram */
async function post(page :Page, { imagePath, caption } :InstagramPost) {
  const NEWPOST_SELECTOR: string = `[aria-label="New Post"]`;
  const IMAGE_UPLOAD_SELECTOR: string = '[accept="image/jpeg"]';
  const GUIDE_LINE_SELECTOR: string = `[style="right: 33%; top: 0%; width: 1px; height: 100%;"]`;
  const HEADER_BUTTONS_SELECTOR: string = `header > div > div > button`;
  const CAPTION_SELECTOR: string = '[aria-label="Write a caption…"]';

  /* go to instagram main page */
  await page.goto('https://www.instagram.com');

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
}

type FollowOptions = {
  infinite: boolean | undefined;
}

/** Follows all users in suggested follows list
 * @param {Page} The page to act on */
async function followAll(page :Page, followOptions :FollowOptions) {
  const FOLLOW_BUTTONS_SELECTOR = 'li > div > div > div > button';

  followOptions = followOptions || {};
  followOptions.infinite = followOptions.infinite || false;

  do {
    /* go to instagram suggested follows */
    await page.goto('https://www.instagram.com/explore/people/suggested/');

    await page.waitFor(FOLLOW_BUTTONS_SELECTOR);

    let followButtons = await page.$$(FOLLOW_BUTTONS_SELECTOR);
    let lastButtonIndex = 0;

    console.log(followButtons.length);

    followButtons.sort(() => Math.random() > 0.5 ? 1 : -1);

    for (let i = lastButtonIndex; i < followButtons.length; ++i) {
      await followButtons[i].focus();
      await followButtons[i].tap();

      await page.waitFor(500 + Math.floor(Math.random() * 500));
    }

  } while (followOptions.infinite);

}

export { createSession, login, post, followAll };
const puppeteer = require('puppeteer');

const config = require('./config');
const credentials = require('./credentials');

const USERNAME_SELECTOR: string = '[name="username"]';
const PASSWORD_SELECTOR: string = '[name="password"]';
const LOGIN_SELECTOR: string = 'form > span > button';

const NOTNOW_SELECTOR: string = '[href="/"]';

const NEWPOST_SELECTOR: string = `[aria-label="New Post"]`;
const IMAGE_UPLOAD_SELECTOR: string = '[accept="image/jpeg"]';

const GUIDE_LINE_SELECTOR: string = `[style="right: 33%; top: 0%; width: 1px; height: 100%;"]`;
const HEADER_BUTTONS_SELECTOR: string = `header > div > div > button`;

const CAPTION_SELECTOR: string = '[aria-label="Write a caption…"]';

type InstagramPost = {
  imagePath: string;
  caption: string;
}

/** posts content to instagram
 * @param {InstagramPost} the content you want to post to instagram */
async function post({ imagePath, caption }: InstagramPost) {
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

  } catch (error) {
    throw error;
  }
}

export { post };
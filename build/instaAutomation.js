"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require('puppeteer');
const { saveImage, squareImage } = require('./utils');
const config = require('./config');
/** creates a puppeteer session
 * @param {boolean} show Whether to run via the browser
 */
function createSession(show) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer.launch({ headless: !show, slowMo: show ? 20 : 0 });
        const page = yield browser.newPage();
        page.setUserAgent(config.userAgent);
        page.setViewport({ width: 1000, height: 1000 });
        return page;
    });
}
exports.createSession = createSession;
/** logs onto instagram
 * @param {Page} page the puppeteer page to act on
 * @param {credentials} credentials Insta account credentials */
function login(page, { username, password }) {
    return __awaiter(this, void 0, void 0, function* () {
        const USERNAME_SELECTOR = '[name="username"]';
        const PASSWORD_SELECTOR = '[name="password"]';
        const LOGIN_SELECTOR = 'form > span > button';
        const NOTNOW_SELECTOR = '[href="/"]';
        /* go to login page */
        yield page.goto('https://www.instagram.com/accounts/login/');
        /* authenticate with username, password */
        yield page.waitFor(USERNAME_SELECTOR);
        yield page.waitFor(PASSWORD_SELECTOR);
        yield page.tap(USERNAME_SELECTOR);
        yield page.keyboard.type(username);
        yield page.tap(PASSWORD_SELECTOR);
        yield page.keyboard.type(password);
        yield page.tap(LOGIN_SELECTOR);
        /* dismiss prompt to remember user */
        yield page.waitFor(NOTNOW_SELECTOR);
        yield page.tap(NOTNOW_SELECTOR);
    });
}
exports.login = login;
/** posts content to instagram
 * @param {Page} page The page to act on
 * @param {InstagramPost} the content you want to post to instagram */
function post(page, { imageUrl, caption }) {
    return __awaiter(this, void 0, void 0, function* () {
        const NEWPOST_SELECTOR = `[aria-label="New Post"]`;
        const IMAGE_UPLOAD_SELECTOR = '[accept="image/jpeg"]';
        const GUIDE_LINE_SELECTOR = `[style="right: 33%; top: 0%; width: 1px; height: 100%;"]`;
        const HEADER_BUTTONS_SELECTOR = `header > div > div > button`;
        const CAPTION_SELECTOR = '[aria-label="Write a caption…"]';
        /* go to instagram main page */
        yield page.goto('https://www.instagram.com');
        /* download image */
        imageUrl = yield saveImage(imageUrl);
        imageUrl = yield squareImage(imageUrl);
        /* post image */
        yield page.waitFor(NEWPOST_SELECTOR);
        yield page.tap(NEWPOST_SELECTOR);
        const fileUploadInputs = yield page.$$(IMAGE_UPLOAD_SELECTOR);
        for (let i = 0; i < fileUploadInputs.length; ++i) {
            let fileUploadInput = fileUploadInputs[i];
            yield fileUploadInput.uploadFile(imageUrl);
        }
        /* confirm image editing */
        yield page.waitFor(GUIDE_LINE_SELECTOR);
        let headerButtons = yield page.$$(HEADER_BUTTONS_SELECTOR);
        yield headerButtons[1].tap();
        /* adding comment */
        yield page.waitFor(CAPTION_SELECTOR);
        yield page.tap(CAPTION_SELECTOR);
        yield page.keyboard.type(caption);
        headerButtons = yield page.$$(HEADER_BUTTONS_SELECTOR);
        yield headerButtons[1].tap();
    });
}
exports.post = post;
/** Follows all users in suggested follows list
 * @param {Page} The page to act on */
function followAll(page, followOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const FOLLOW_BUTTONS_SELECTOR = 'li > div > div > div > button';
        followOptions = followOptions || {};
        followOptions.infinite = followOptions.infinite || false;
        do {
            /* go to instagram suggested follows */
            yield page.goto('https://www.instagram.com/explore/people/suggested/');
            yield page.waitFor(FOLLOW_BUTTONS_SELECTOR);
            let followButtons = yield page.$$(FOLLOW_BUTTONS_SELECTOR);
            let lastButtonIndex = 0;
            followButtons.sort(() => Math.random() > 0.5 ? 1 : -1);
            for (let i = lastButtonIndex; i < followButtons.length; ++i) {
                yield followButtons[i].focus();
                yield followButtons[i].tap();
                yield page.waitFor(300 + Math.floor(Math.random() * 300));
            }
        } while (followOptions.infinite);
    });
}
exports.followAll = followAll;

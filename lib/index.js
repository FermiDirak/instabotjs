#!/usr/bin/env node

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { appendRandomTags, saveImage, squareImage } = require('./utils');
const config = require('./config');
const program = require('commander');
const instaAutomation = require('./instaAutomation');
const { retrieveRedditPost } = require('./reddit-scraper');
// program
//   .version('1.0.0')
//   .parse(process.argv);
/** main */
(() => __awaiter(this, void 0, void 0, function* () {
    try {
        const session = yield instaAutomation.createSession();
        yield instaAutomation.login(session);
        while (true) {
            const redditPost = yield retrieveRedditPost();
            redditPost.topComment = appendRandomTags(redditPost.topComment);
            const fileName = yield saveImage(redditPost.imageUrl);
            yield squareImage(fileName);
            const imagePath = __dirname + '/postimage.png';
            console.log(redditPost);
            yield instaAutomation.post(session, { imagePath, caption: redditPost.topComment });
            yield instaAutomation.followAll(session);
        }
    }
    catch (error) {
        console.error(error);
    }
}))();

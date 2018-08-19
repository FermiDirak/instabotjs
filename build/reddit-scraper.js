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
const axios = require('axios');
const config = require('./config');
const { imageFormats } = require('./constants');
/** retrieves a random reddit post from the front page of subreddit */
function retrieveRedditPost() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `https://www.reddit.com/r/${config.subreddit}/.json`;
            const response = yield axios.get(url);
            const data = yield response.data;
            const redditPost = yield pluckRandomPost(data.data.children);
            return redditPost;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.retrieveRedditPost = retrieveRedditPost;
/** plucks a random post from a page of reddit posts
 * @param {Array<Post>} posts A list of posts
 * @return {Promise<RedditPost>} instagram ready post data
 */
function pluckRandomPost(posts) {
    return __awaiter(this, void 0, void 0, function* () {
        posts = posts.sort(() => Math.random() > 0.5 ? 1 : -1);
        let post = posts[0];
        let i = 0;
        while (true) {
            if (i >= posts.length) {
                throw 'out of range';
            }
            post = posts[i];
            const { url: imageUrl, num_comments } = post.data;
            const imageUrlSuffix = imageUrl.split('.').pop();
            if (num_comments > 0 && imageFormats.has(imageUrlSuffix)) {
                break;
            }
            i += 1;
        }
        const { title, url: imageUrl } = post.data;
        const topComment = yield getTopComment(post);
        return {
            title,
            imageUrl,
            topComment,
        };
    });
}
/** gets the top comment from the reddit post
 * @param {Post} a post to retrieve a top comment from
 * @return {Promise<string>} top comment */
function getTopComment(post) {
    return __awaiter(this, void 0, void 0, function* () {
        const { permalink } = post.data;
        const commentsUrl = `https://www.reddit.com/${permalink}.json`;
        const response = yield axios.get(commentsUrl);
        const comments = response.data[1].data.children;
        return comments[0].data.body || post.data.title || '';
    });
}

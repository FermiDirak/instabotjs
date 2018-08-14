const axios = require('axios');
const config = require('./config');

const { imageFormats } = require('./constants');

/** retrieves a random reddit post from the front page of subreddit */
async function retrieveRedditPost() {
  try {
    const url = `https://www.reddit.com/r/${config.subreddit}/.json`;
    const response = await axios.get(url);
    const data = await response.data;

    const redditPost = await pluckRandomPost(data.data.children);

    return redditPost;

  } catch (error) {
    throw error;
  }
}

/** plucks a random post from list of posts
 * @param {obj} posts Response representing top posts from subreddit
 * @return {obj} instagram ready post data
 */
async function pluckRandomPost(posts) {
  posts = posts.sort((a, b) => Math.random() > 0.5 ? 1 : -1);

  for (let i = 0; i < 1; ++i) {
    let post = posts[i];

    const { title, url: imageUrl, num_comments } = post.data;

    const imageUrlSuffix = imageUrl.split('.').pop();

    if (num_comments === 0 || !imageFormats.has(imageUrlSuffix)) {
      continue;
    }

    let topComment = '';

    try {
      topComment = await getTopComment(post);
    } catch (error) {
      throw error;
    }

    return {
      title,
      imageUrl,
      topComment,
    };
  }

}

/** gets the top comment from the reddit post
 * @param {string} a json representation of the post to retrieve a comment from
 * @return {string} top comment */
async function getTopComment(post) {
  try {
    const { permalink } = post.data;
    const commentsUrl = `https://www.reddit.com/${permalink}.json`;
    const response = await axios.get(commentsUrl);

    const comments = response.data[1].data.children;

    return comments[0].data.body;

  } catch(error) {
    return post.title || error;
  }
}

module.exports = { retrieveRedditPost };
const axios = require('axios');
const config = require('./config');

const { imageTypes } = require('./constants');

async function retrieveRedditPost() {
  try {
    const url = `https://www.reddit.com/r/${config.subreddit}/.json`;
    const response = await axios.get(url);
    const data = await response.data;

    const redditPost = await pluckRandomPost(data.data.children);

    return redditPost;

  } catch (error) {
    console.error(error);
  }
}

async function pluckRandomPost(posts) {
  posts = posts.sort((a, b) => Math.random() > 0.5 ? 1 : -1);

  for (let i = 0; i < 1; ++i) {
    let post = posts[i];

    const { title, url: imageUrl, num_comments } = post.data;

    const imageUrlSuffix = imageUrl.split('.').pop();

    if (num_comments === 0 || !imageTypes.has(imageUrlSuffix)) {
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


async function getTopComment(post) {
  try {
    const { permalink } = post.data;
    const commentsUrl = `https://www.reddit.com/${permalink}.json`;
    const response = await axios.get(commentsUrl);

    const comments = response.data[1].data.children;

    return comments[0].data.body;

  } catch(error) {
    return error;
  }
}

module.exports = { retrieveRedditPost };
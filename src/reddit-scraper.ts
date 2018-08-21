const axios = require('axios');
const config = require('./config');

const { imageFormats } = require('./constants');

type Post = {
  data: {
    title: string,
    name: string,
    id: string,
    author: string,
    num_comments: number,
    permalink: string,
    url: string,
  }
}

type RedditPost = {
  title: string;
  imageUrl: string;
  topComment: string;
}

/** retrieves a random reddit post from the front page of subreddit */
async function retrieveRedditPost() :Promise<RedditPost> {
  try {
    const subreddit = config.subreddits[Math.floor(Math.random() * config.subreddits.length)];

    const url = `https://www.reddit.com/r/${subreddit}/.json`;
    const response = await axios.get(url);
    const data = await response.data;

    const redditPost = await pluckRandomPost(data.data.children);
    return redditPost;

  } catch (error) {
    throw error;
  }
}

/** plucks a random post from a page of reddit posts
 * @param {Array<Post>} posts A list of posts
 * @return {Promise<RedditPost>} instagram ready post data
 */
async function pluckRandomPost(posts :Array<Post>) :Promise<RedditPost> {
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
  const topComment = await getTopComment(post);

  return {
    title,
    imageUrl,
    topComment,
  };
}

/** gets the top comment from the reddit post
 * @param {Post} a post to retrieve a top comment from
 * @return {Promise<string>} top comment */
async function getTopComment(post :Post) :Promise<string> {
    const { permalink } = post.data;
    const commentsUrl = `https://www.reddit.com/${permalink}.json`;
    const response = await axios.get(commentsUrl);

    const comments = response.data[1].data.children;
    return comments[0].data.body || post.data.title || '';
}

export { retrieveRedditPost };
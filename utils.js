const imageDownloader = require('image-downloader')

const config = require('./config');

/** picks config.tagsCount random tags from config.tags list
 * @return string Stringified list of random tags */
function pickRandomTags() {
  const tags = config.tags.sort((a, b) => Math.random() > 0.5 ? 1 : -1);
  let res = '';

  for (let i = 0; i < config.tagsCount; ++i) {
    res += `#${tags[i]} `;
  }

  return res.trim();
}

function appendRandomTags(text) {
  return text + ' ' + pickRandomTags();
}

/** saves the image to config.imageName
 * @return {string} image name */
async function saveImage(url) {
  const options = {
    url: url,
    dest: config.imageName + '.' + url.split('.').pop(),
  }

  const { filename } = await imageDownloader.image(options);

  return filename;
}

module.exports = { appendRandomTags, saveImage };
const imageDownloader = require('image-downloader');
const sizeOf = require('image-size');
const sharp = require('sharp');

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

async function squareImage(fileName) {
  try {
    const dimensions = await sizeOf(fileName);
    const maxDimension = Math.max(dimensions.height, dimensions.width);

    await sharp(fileName)
      .resize(maxDimension, maxDimension)
      .background({r: 255, g: 255, b: 255, alpha: 1})
      .embed()
      .toFormat('png')
      .toFile('postimage.png');

  } catch (error) {
    throw error;
  }
}

module.exports = { appendRandomTags, saveImage, squareImage };
const imageDownloader = require('image-downloader');
const sizeOf = require('image-size');
const sharp = require('sharp');

const config = require('./config');

/** picks config.tagsCount random tags from config.tags list
 * @return {string} Stringified list of random tags */
function pickRandomTags() :string {
  const tags :Array<string> = config.tags.sort((a :string, b :string) => Math.random() > 0.5 ? 1 : -1);
  let res :string = '';

  for (let i = 0; i < config.tagsCount; ++i) {
    res += `#${tags[i]} `;
  }

  return res.trim();
}

/** appends a random list of tags to the input string
 * @param {string} text Text to append tags to
 * @return {string} text with tags appended */
function appendRandomTags(text :string) :string {
  return `${text} ${pickRandomTags()}`;
}

type SaveOptions = {
  url: string;
  dest: string;
}

/** saves the image to config.imageName
 * @param url THe url to download an image from
 * @return {Promise<string>} image name */
async function saveImage(url :string) :Promise<string> {
  const options :SaveOptions = {
    url: url,
    dest: `${__dirname}/temp.${url.split('.').pop()}`,
  }

  const { filename } = await imageDownloader.image(options);
  return filename;
}

/**
 * Pads an image and makes it square and outputs it to postimage.png
 * @param fileName The file to add padding to make square
 * @return {Promise<string>} The filepatah of the square image */
async function squareImage(fileName :string) :Promise<string> {
  try {
    const dimensions = await sizeOf(fileName);
    const maxDimension = Math.max(dimensions.height, dimensions.width);

    await sharp(fileName)
      .resize(maxDimension, maxDimension)
      .background({r: 255, g: 255, b: 255, alpha: 1})
      .embed()
      .toFormat('png')
      .toFile(__dirname + '/postimage.png');

  } catch (error) {
    throw error;
  }

  return `${__dirname}/postimage.png`;
}

export { appendRandomTags, saveImage, squareImage };
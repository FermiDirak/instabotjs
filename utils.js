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

module.exports = { pickRandomTags };
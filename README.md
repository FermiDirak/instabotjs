# Instabot.js

Instabot JS is a CLI-based Instagram bot that lets you automate posting, following, and reposting memes from your favorite subreddit onto Instagram!

This Instagram CLI will let you:
* Repost memes directly from Reddit
* Post custom Instagram posts { imageUrl, caption } from the CLI
* Automate following users from your suggested users list

## Getting Started

Install the package: `npm install -g instabotjs`
Once installed, you can begin using instabot-cli.

## Usage

[![asciicast](usage.gif)](usage.gif)

`$ instabot [options]`

To start instabot, run:
`instabot -u "Instagram Username"`

Once your instagram is logged in via puppeteer, select an action:
```
❯ 1) repost post from Reddit
❯ 2) create a custom post
❯ 3) follow all from suggested
❯ 4) exit
```

## Built With

* NodeJS
* Typescript
* Puppeteer

## Contributing

If you contribute to this project your name will be added to the contributors list.

* Fermi Dirak (owner)
* aziz512 (contributor)

## Versioning

InstabotJS follows semantic versioning following the syntax `MAJOR.MINOR.PATCH`

## Future Features

* Ability to pass in environmental variables to specify which subreddits to pull content from
* Integration of a SQLite database for storing visited Reddit IDs to ensure content isn't reposted twice
* More robust follow and refollow capabilities

## License

This project is licensed under the WTFPL License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Reddit - for their magnificent API. Thank you Reddit!
* Facebook - for my Instafam and making this project worthwhile \\:)/
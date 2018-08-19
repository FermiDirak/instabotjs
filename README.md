# Instabot.js

Instabot JS is an ethical bot that reposts top memes from your favorite subreddit onto instagram and uses the top comment from post's the comment thread as the caption.

## Setup

```
npm install -g instabotjs
instabot -h
```

## Getting Started

So you want to run your own instabot? These instructions will get you a copy of the project up and running on your local machine for execution, development, and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

```
yarn or npm // install either with brew if you're on Mac
```

### Installing

A step by step series of examples that tell you how to get Instabot running

```
cd project-directory
yarn install // downloads your dependencies
mv config.example.js config.js // set up your config with the default
```

To see if your instabot is working, try running it with `yarn start`

## Running the tests

Typescript is used for type checking. There are currently no tests, but feel free to add some if  you'd like.

To run Instabot, execute its start script: `yarn start`. Expect Instabot to have an API at a future time.

### And coding style tests

All new features must be coded in ES6+ syntax with Typescript. There is currently no styleguide enforced but please keep best practices in mind.

## Built With

* NodeJS
* Typescript
* Puppeteer

## Contributing

If you contribute to this project your name will be added to the contributors list.

* Fermi Dirak (owner)
* aziz512 (contributor)

## Versioning

There currently is no versioning as this package is still in pre-release.

## License

This project is licensed under the WTFPL License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Reddit - for their magnificent API. Thank you Reddit!
* Facebook - for my Instafam and making this project worthwhile \\:)/
# generator-dk [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> 🏗 Yeoman generator to scaffold my projects

## Installation

First, install [Yeoman](http://yeoman.io) and `generator-dk` using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo generator-dk
```

## Usage

Generate a new project by running:

```bash
mkdir my-project
cd my-project
yo dk
```

### Subgenerators

All subgenerators are currently called in the main `app` generator. However, you can also call them separately.

Available subgenerators are:

* `dk:badges` - Inserts a list of badges into your `README.md`
* `dk:coc` - Creates a Code of Conduct file and references it in the `README.md`
* `dk:contributors` - Initializes an [`all-contributors`](https://npm.im/all-contributors) project
* `dk:lint` - Configures ESLint
* `dk:typescript` - Installs TypeScript dependencies & initializes project
* `dk:wireframe` - Creates an initial file as well as dependenies and run scripts

## Contributing

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md).
By participating in this project you agree to abide by its terms.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/1505101?v=4" width="100px;"/><br /><sub><b>Dominik Kundel</b></sub>](https://dkundel.com)<br />[💻](https://github.com/dkundel/generator-dk/commits?author=dkundel "Code") [🎨](#design-dkundel "Design") [🤔](#ideas-dkundel "Ideas, Planning, & Feedback") [👀](#review-dkundel "Reviewed Pull Requests") [📖](https://github.com/dkundel/generator-dk/commits?author=dkundel "Documentation") |
| :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## License

MIT © [Dominik Kundel](https://dkundel.com)

[npm-image]: https://badge.fury.io/js/generator-dk.svg
[npm-url]: https://npmjs.org/package/generator-dk
[travis-image]: https://travis-ci.org/dkundel/generator-dk.svg?branch=master
[travis-url]: https://travis-ci.org/dkundel/generator-dk
[daviddm-image]: https://david-dm.org/dkundel/generator-dk.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/dkundel/generator-dk

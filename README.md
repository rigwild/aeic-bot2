# aeic-bot2
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

A bot to manage the student association's Discord server of IUT du Littoral Côte d'Opale at Calais. This is a successor to [rigwild/aeic-bot](https://github.com/rigwild/aeic-bot).

Also contains a Dashboard to manage member's account and commonly used IUT Calais services, to make life easier.

This is probably **overkill**. It is a really good example on how to manage a [monorepo](https://en.wikipedia.org/wiki/Monorepo) project, containing back-end/front-end/common packages.

## Install all packages
```sh
lerna bootstrap
```

## Packages
| Package | Description |
| ------- | ----------- |
| [`@aeic-bot2/common`](./packages/common) | Common monorepo types, utils and default values |
| [`@aeic-bot2/core`](./packages/core) | Main core handlers: Discord bot, Database and more |
| [`@aeic-bot2/bot`](./packages/bot) | Discord bot interface |
| [`@aeic-bot2/dashboard-back`](./packages/dashboard-back) | Dashboard back-end |
| [`@aeic-bot2/dashboard-front`](./packages/dashboard-front) | Dashboard front-end |

## Discord bot documentation
See [`@aeic-bot2/bot/docs`](./packages/bot/docs/index.md).

## Deployement tutorial
See [`DEPLOY_GUIDE`](./DEPLOY_GUIDE.md).

## Contributing
If you want to contribute to this project, you can open an [issue](https://github.com/rigwild/aeic-bot2/issues) detailing your suggestions or bugs.

Feel free to open a [pull request](https://github.com/rigwild/aeic-bot2/pulls).

## License
[The MIT license](./LICENSE)

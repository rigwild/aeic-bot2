# aeic-bot2
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

A bot to manage the student association's Discord server of IUT du Littoral Côte d'Opale at Calais. This is a successor to [rigwild/aeic-bot](https://github.com/rigwild/aeic-bot).

## Packages
| Package | Description |
| ------- | ----------- |
| [`@aeic-bot2/bot`](./packages/bot) | Main Discord bot |
| [`@aeic-bot2/dashboard-back`](./packages/dashboard-back) | Dashboard back-end |
| [`@aeic-bot2/dashboard-front`](./packages/dashboard-front) | Dashboard front-end |

## Discord bot documentation
See [`@aeic-bot2/bot/docs`](./packages/bot/docs/index.md).

## Configuration
### Bot and dashboard back-end
You can configure the bot and the dashboard back-end by setting environment variables. Copy [`./.env.example`](./.env.example) to `./.env` and edit this file.

| Configuration option | Description | Default value |
| -------------------- | ----------- | ------------- |
| `COMMAND_TRIGGER` | String to use before a command to trigger it | `!` |
| `ARG_SEPARATOR` | Command argument separator | `--` |
| `DEV_DISCORD_ID` | Bot's developer Discord ID | `411139773940629514` |
| `DOC_URI` | URI to the bot's commands documentation | `https://git.io/aeic-bot2-docs` |
| `PLANNING_LINK` | Link to a [rigwild/planning-iut-calais](https://github.com/rigwild/planning-iut-calais) server | `https://planning-iut-calais.asauvage.fr` |
| `EXO_PLATFORM_LINK` | Link to an eXo Platform server | `iut.univ-littoral.fr` |
| `AUTO_REMINDER_CRON_TIME` | Cron time configuration for the reminder service, defaults to everyday à 19:00 | `0 19 * * *` |
| `DISCORD_AUTH_TOKEN` | Discord bot's token |  |
| `DISCORD_SERVER_ID` | Discord server's ID to manage | `327121464996134922` |
| `MONGO_URI` | MongoDB connecton URI | `mongodb://localhost:27017/aeic-bot2` |
| `EXO_PLATFORM_USERNAME` | eXo Platform account username |  |
| `EXO_PLATFORM_PASSWORD` | eXo Platform account password |  |
| `SERVER_PORT` | Dashboard back-end server port | `5000` |
| `SERVER_SECRET` | Dashboard back-end server JWT signing secret |  |
| `DISCORD_REDIRECT_URI` | Discord app redirect uri to the dashboard front-end | `https://dashboard-front-end.com/#/discordCallback` |
| `DISCORD_CLIENT_ID` | Discord app client ID |  |
| `DISCORD_CLIENT_SECRET` | Discord app client secret |  |

### Dashboard front-end
You can configure the dashboard front-end by setting environment variables. Copy [`@aeic-bot2/dashboard-front/.env.example`](./packages/dashboard-front/.env.example) to `@aeic-bot2/dashboard-front/.env` and edit this file.

| Configuration option | Description | Default value |
| -------------------- | ----------- | ------------- |
| `VUE_APP_API_PREFIX` | Dashboard back-end URI | `https://dashboard-back-end.com/api` |

## Contributing
If you want to contribute to this project, you can open an [issue](https://github.com/rigwild/aeic-bot2/issues) detailing your suggestions or bugs.

Feel free to open a [pull request](https://github.com/rigwild/aeic-bot2/pulls).

## License
[The MIT license](./LICENSE)

# aeic-bot2
A bot to manage the student association's Discord server of IUT du Littoral Côte d'Opale at Calais.

This is a successor of [rigwild/aeic-bot](https://github.com/rigwild/aeic-bot)

## Install
```sh
yarn
```

## Build
```sh
yarn build
```

## Build documentation
```sh
yarn doc
```

## Start
```sh
yarn start
```

## Configuration
You can configure the project by editing [`/src/config.ts`](./src/config.ts#L35-L42):

| Configuration option | Description | Default value |
| -------------------- | ----------- | ------------- |
| `COMMAND_TRIGGER` | String to use before a command to trigger it | `!` |
| `ARG_SEPARATOR` | Command argument separator | `--` |
| `DEV_DISCORD_ID` | Bot's developer Discord ID | `411139773940629514` |
| `DOC_URI` | URI to the bot's commands documentation | `https://git.io/aeic-bot2` |
| `PLANNING_LINK` | Link to a [rigwild/planning-iut-calais](https://github.com/rigwild/planning-iut-calais) server | `https://planning-iut-calais.asauvage.fr` |
| `EXO_PLATFORM_LINK` | Link to an eXo Platform server | `iut.univ-littoral.fr` |
| `AUTO_REMINDER_CRON_TIME` | Cron time configuration for the reminder service, defaults to everyday à 19:00 | `0 19 * * *` |

Sensitive configurations must be set via environment variables:

| Environment variable | Description | Default value |
| -------------------- | ----------- | ------------- |
| `DISCORD_AUTH_TOKEN` | Discord bot's token |  |
| `DISCORD_SERVER_ID` | Discord server's ID to manage | `327121464996134922` |
| `MONGO_URI` | MongoDB connecton URI | `mongodb://localhost:27017/aeic-bot2` |
| `EXO_PLATFORM_USERNAME` | eXo Platform account username |  |
| `EXO_PLATFORM_PASSWORD` | eXo Platform account password |  |

## Usage documentation
See [`/docs`](./docs/index.md) (french).

## Contributing
If you want to contribute to this project, you can open an [issue](https://github.com/rigwild/aeic-bot2/issues) detailing your suggestions or bugs.

Feel free to open a [pull request](https://github.com/rigwild/aeic-bot2/pulls).

## License
[The MIT license](./LICENSE)

# Deployement guide
This is a tutorial to deploy every components of the monorepo.

## Summary
- [Summary](#summary)
- [General instructions](#general-instructions)
  * [Install](#install)
  * [Build all](#build-all)
- [Configuration](#configuration)
  * [Bot and dashboard back-end](#bot-and-dashboard-back-end)
  * [Dashboard front-end](#dashboard-front-end)
- [Discord bot deployement](#discord-bot-deployement)
  * [Native](#native)
  * [Using PM2](#using-pm2)
- [Dashboard deployement](#dashboard-deployement)
  * [NGINX configuration](#nginx-configuration)
  * [Start back-end server](#start-back-end-server)
    + [Native](#native-1)
    + [Using PM2](#using-pm2-1)

## General instructions
### Install
 - Install dependencies
 - Build `@aeic-bot2/core` and `@aeic-bot2/common`
 - Link packages

```sh
lerna bootstrap
```

### Build all
```sh
lerna run build
```

## Configuration
### Bot and dashboard back-end
You can configure the bot and the dashboard back-end by setting environment variables. Copy [`.env.example`](./.env.example) to `.env` and edit this file.

**This is required**.

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

**This is not required**.

| Configuration option | Description | Default value |
| -------------------- | ----------- | ------------- |
| `VUE_APP_API_PREFIX` | Dashboard back-end URI | `/api` |

## Discord bot deployement
### Native
```sh
yarn start
```

### Using PM2
```sh
pm2 start npm --name "aeic-bot2 Discord bot" -- run start
```

## Dashboard deployement
### NGINX configuration
```sh
nano /etc/nginx/sites-available
```

Replace all occurences of `aeic-bot2.asauvage.fr` with your domain.
```
upstream aeic-bot2.asauvage.fr {
  server 127.0.0.1:1432;
  keepalive 8;
}

server {
  listen [::]:80;
  server_name aeic-bot2.asauvage.fr;
  access_log /var/log/nginx/aeic-bot2.asauvage.fr_access.log;
  error_log /var/log/nginx/aeic-bot2.asauvage.fr_error.log warn;

  location /api/ {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;

    proxy_pass http://aeic-bot2.asauvage.fr/;
    proxy_redirect off;
  }

  location / {
    root /var/www/aeic-bot2/packages/dashboard-front/dist;
  }
}
```

Create a link to activate the configuration in NGINX.
```sh
ln -s /etc/nginx/sites-available/aeic-bot2.asauvage.fr /etc/nginx/sites-enabled/aeic-bot2.asauvage.fr
```

Restart NGINX
```sh
service nginx restart
```

### Start back-end server
#### Native
```sh
yarn start
```

#### Using PM2
```sh
pm2 start npm --name "aeic-bot2.asauvage.fr" -- run start
```

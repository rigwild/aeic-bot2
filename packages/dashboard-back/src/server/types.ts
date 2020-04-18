import { Request, Response, NextFunction } from 'express-serve-static-core'

import { User } from '@aeic-bot2/core/dist/types'

export declare interface LoggedDiscordUserRequestHandler {
  (
    req: (Request & {
      user: {
        id: User['id']
        discordToken: string
      }
    }),
    res: Response,
    next: NextFunction
  ): any
}

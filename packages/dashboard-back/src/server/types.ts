import { Request, Response, NextFunction } from 'express'
import { User } from 'discord.js'

export declare interface LoggedDiscordUserRequestHandler {
  (req: (Request & { user: { id: User['id'] } }), res: Response, next: NextFunction): any
}

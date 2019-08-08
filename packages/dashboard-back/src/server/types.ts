import express, { Request, Response, NextFunction } from 'express'
import { User } from 'discord.js'

export declare interface LoggedDiscordUserRequestHandler {
  (req: (Request & { user: User }), res: Response, next: NextFunction): any
}

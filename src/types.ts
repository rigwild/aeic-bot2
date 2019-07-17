import { Message } from 'discord.js'

export declare type CommandRunner = (
  /** Received Discord message object */
  message: Message,
  /** Received arguments */
  ...args: string[]
) => Promise<void>

export declare interface CommandMetadata {
  /** Command name */
  command: string
  minArgs: number
  maxArgs?: number
  /** Command short description */
  shortDescription?: string
  /** Command description */
  description?: string
  /** Command usage example */
  example?: string
}
export declare interface Command {
  /** Command execution */
  run: CommandRunner
  /** Command metadata */
  meta: CommandMetadata
}

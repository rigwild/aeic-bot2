import { Message } from 'discord.js'

export declare type CommandRunner = (
  /** Received Discord message object */
  message: Message,
  /** Received arguments */
  ...args: string[]
) => Promise<any>

export declare interface CommandMetadata {
  /** Command name */
  command: string
  minArgs: number
  maxArgs?: number
  /** Command description */
  description: string
  /** Command usage example */
  examples: string[]
}
export declare interface Command {
  /** Command execution */
  run: CommandRunner
  /** Command metadata */
  meta: CommandMetadata
}

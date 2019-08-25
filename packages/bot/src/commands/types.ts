import { Message, TextChannel } from '@aeic-bot2/core/dist/types'

export declare type DiscordMessageForcedTextChannel = Message & { channel: TextChannel }

export declare type CommandRunner = (
  /** Received Discord message object */
  message: DiscordMessageForcedTextChannel,
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

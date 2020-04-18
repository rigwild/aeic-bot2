import boom from '@hapi/boom'
import { ErrorRequestHandler } from 'express-serve-static-core'

import { LoggedDiscordUserRequestHandler } from './types'

/**
 * Call the error handler if a middleware function throw an error
 *
 * @param {Function} fn original middleware function of the route
 * @returns {Promise<Function>} the same middleware function of the route but error handled
 */
export const asyncMiddleware = (fn: LoggedDiscordUserRequestHandler) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    next(err)
  })
}

// Middleware to handle middleware errors
export const errorHandler: ErrorRequestHandler = (err: any, req: any, res: any, next: any) => {
  // Check whether the error is a boom error
  if (!err.isBoom) {
    // Check if error is invalid JSON body
    if (err instanceof SyntaxError && err.hasOwnProperty('body'))
      err = boom.badRequest(err.message)
    else if (err.name === 'UnauthorizedError')
      err = boom.unauthorized(err)
    else {
      // The error was not recognized, send a 500 HTTP error
      err = boom.internal(err)
      err
    }
  }

  const { output: { payload } } = err

  // Pass the error to the logging handler
  let errorLogged = new Error(`Error ${payload.statusCode} - ${payload.error} - Message :\n${payload.message}`)
  errorLogged.stack = err.stack
  console.error(errorLogged)

  // Send the error to the client
  res.status(payload.statusCode).json({
    message: err.message || payload.message,
    data: err.data || undefined
  })

  next()
}

/**
 * Check the request contains all the required parameters
 * @param requiredParameters List of all required parameters
 * @param parameters Parameters provided in the request (req.query)
 * @throws Missing parameters
 */
export const checkRequiredParameters = <T = string>(requiredParameters: string[], parameters: { [key: string]: T }): { [key: string]: T } => {
  if (!requiredParameters.every(aRequiredParameter => parameters.hasOwnProperty(aRequiredParameter)))
    throw boom.badRequest(`Missing parameter(s). Required parameters : ${requiredParameters.join(', ')}.`)
  return parameters
}

/**
 * Remove accents from a string
 * @param str String to format
 * @returns Formatted string
 */
export const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

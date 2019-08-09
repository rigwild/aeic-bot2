import boom from '@hapi/boom'
import expressJwt from 'express-jwt'
import { RequestHandler } from 'express'

import { SERVER_SECRET } from '../config'

// Turning of valid-jsdoc rule for this file
/* eslint valid-jsdoc: 0 */

/**
 * Check the request contains a valid JWT.
 * Will set the content of the JWT in `req.user`.
 */
export const checkJwt = expressJwt({ secret: SERVER_SECRET })

/**
 * Check the request does not contain a Authorization header.
 * @throws The Authorization header is set
 */
export const checkNoJwt: RequestHandler = (req, res, next) => {
  if (req.headers.authorization)
    throw boom.conflict('You can\'t access this resource with a authorization header token set.')
  next()
}

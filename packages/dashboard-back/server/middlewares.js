import boom from '@hapi/boom'
import expressJwt from 'express-jwt'

import { SERVER_SECRET } from '../config'
import { dataCollection } from './db'

// Turning of valid-jsdoc rule for this file
/* eslint valid-jsdoc: 0 */

/**
 * Check the request contains a valid JWT.
 *
 * Will set the content of the JWT in `req.user`.
 */
export const checkJwt = expressJwt({
  secret: SERVER_SECRET,
  isRevoked: (req, payload, done) => {
    if (payload.id) {
      const res = dataCollection.findOne({ 'discordUser.id': payload.id })
      if (!res) done(boom.notFound('User not found in database'), true)
    }
    else done(boom.badRequest('Invalid JWT payload content'))
    done(null, false)
  }
})

/**
 * Check the request does not contain a Authorization header.
 * @throws The Authorization header is set
 */
export const checkNoJwt = (req, res, next) => {
  if (req.headers.authorization)
    throw boom.conflict('You can\'t access this resource with a authorization header token set.')
  next()
}

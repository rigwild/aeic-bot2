import express from 'express'
import { request } from 'https'

import { asyncMiddleware, checkRequiredParameters } from '../../utils'

const router = express.Router()

const getMarks = (ine: string): Promise<string> => new Promise((resolve, reject) => {
  const req = request('https://extra.univ-littoral.fr/abs/index.php', {
    method: 'POST',
    secureProtocol: 'TLSv1_method',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, res => {
    let text = ''
    res.on('data', d => text += d)
    res.on('end', () => {
      if (res.statusCode && res.statusCode >= 400)
        reject(new Error(`Received code ${res.statusCode}.`))
      else if (text.includes('Num&eacute;ro &eacute;tudiant inconnu'))
        reject(new Error('Your student identifier was not found.'))
      else resolve(text)
    })
  })
  req.on('error', reject)
  req.write(`code_ine=${ine}&ok=Valider`)
  req.end()
})

// TODO: finish scodoc endpoint
// Find someone on eXo Platform
router.get('/scodoc/:ine', asyncMiddleware(async (req, res) => {
  res.json({ data: 'Not finished' })
  // const { ine } = checkRequiredParameters(['ine'], req.params)
  // res.send(await getMarks(ine))
  // res.json({
  //   data: await getMarks(ine)
  // })
}))

export default router

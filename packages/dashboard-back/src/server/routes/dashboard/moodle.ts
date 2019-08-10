import express from 'express'
import fetch from 'node-fetch'
import boom from '@hapi/boom'

import { asyncMiddleware, checkRequiredParameters } from '../../utils'

const router = express.Router()

// Find someone on eXo Platform
router.post('/moodle', asyncMiddleware(async (req, res) => {
  const { username, password } = checkRequiredParameters(['username', 'password'], req.body)

  const login = await fetch('http://iic0e.univ-littoral.fr/moodle/login/index.php', {
    method: 'POST',
    body: `username=${username}&password=${password}`,
    headers: {
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect: 'manual'
  })

  // Check the credentials are valid
  const cookiesRaw = <string>login.headers.get('set-cookie')
  const match = cookiesRaw.match(/MoodleSession/g)
  if (!match || match.length < 2)
    throw boom.unauthorized('Invalid Moodle username or password.')

  const removeBadCookie = cookiesRaw.match(/\sMoodleSession.*/g)
  if (!removeBadCookie || removeBadCookie.length === 0)
    throw boom.internal()
  const cookies = removeBadCookie[0].substring(1)

  // Fetch the month's calendar
  const calendarPage = await fetch('http://iic0e.univ-littoral.fr/moodle/calendar/view.php?view=month', {
    headers: {
      'Accept-Encoding': 'gzip, deflate',
      'Cookie': cookies
    }
  }).then(res => res.text())

  // Format the code to inject in a sandboxed iframe with minimal code
  // (worst code ever, but it works 🤐)
  const calendarHTML = calendarPage
    .split('<!-- main mandatory content of the moodle page  -->')[1]
    .split('<!-- end of main mandatory content of the moodle page -->')[0]
    .match(/\<table[\s\S]*?\<\/table\>/g)
  if (!calendarHTML || calendarHTML.length === 0) throw boom.internal()
  const calendarHTML2 = calendarHTML[0]

  const calendarCSS = `<link rel="stylesheet" type="text/css" href="http://iic0e.univ-littoral.fr/moodle/theme/yui_combo.php?3.9.1/build/cssreset/cssreset-min.css&3.9.1/build/cssfonts/cssfonts-min.css&3.9.1/build/cssgrids/cssgrids-min.css&3.9.1/build/cssbase/cssbase-min.css" />
  <link rel="stylesheet" type="text/css" href="http://iic0e.univ-littoral.fr/moodle/theme/styles.php/educator/1481619224/all" />
  <style>
  * { font-family: helvetica, arial, sans-serif; }
  .calendarmonth { height: 100%; padding: 0; margin: 0; }
  body { height: 100%; padding: 0; overflow: hidden; margin: 0; background: white; }
  th.header { border: 1px solid #f4f4f4; background-color: #e7e7e7; }
  </style>`

  const calendar = `<html><head>${calendarCSS}</head><body>${calendarHTML2}</body></html>`
  console.log(calendar)
  res.json({
    data: calendar
  })
}))

export default router

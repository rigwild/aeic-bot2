import express from 'express'
import fetch from 'node-fetch'
import boom from '@hapi/boom'

import { asyncMiddleware, checkRequiredParameters } from '../../utils'

const router = express.Router()

// Load a user's Moodle calendar
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
  const calendarHTML = calendarPage
    .split('<!-- main mandatory content of the moodle page  -->')[1]
    .split('<!-- end of main mandatory content of the moodle page -->')[0]
    .match(/\<table[\s\S]*?\<\/table\>/g)
  if (!calendarHTML || calendarHTML.length === 0) throw boom.internal()
  const calendarHTML2 = calendarHTML[0]
    .replace(/<ul class=\"events-new\"><li/g, '<div class="events-new"><div')
    .replace(/<\/li><\/ul>/g, '<\/div><\/div>')
    .replace(/<a href=/g, '<a target="_blank" rel="noopener" href=')

  const calendarHead = `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    * {
      font-family: helvetica, arial, sans-serif;
    }
    table {
      height: 100%;
      width: 100%;
      border-collapse: collapse;
      padding: 0;
      margin: 0;
    }
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      background: white;
    }
    td, th {
      text-align: center;
      border: 1px #E3DFD4 solid;
      border-collapse: collapse;
    }
    td {
      height: 5em;
    }
    th.header {
      height: 2em;
      border: 1px solid #f4f4f4;
      background-color: #e7e7e7;
    }
    td.day.today {
      border: 2px solid #6b6b6b;
    }

    td.day.nottoday.cell {
      width: 100px;
    }
    .events-new {
      display: flex;
      text-align: left;
      align-items: center;
      justify-content: center;
      padding: 5px;
      font-size: 12px;
      flex-direction: column;
    }
    .calendar_event_course {
      margin-bottom: 10px;
      padding: 0;
    }
  </style>`

  const calendar = `<html><head>${calendarHead}</head><body>${calendarHTML2}</body></html>`
  res.json({
    data: calendar
  })
}))

export default router

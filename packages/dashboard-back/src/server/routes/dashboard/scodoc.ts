import express from 'express'
import { request } from 'https'
import boom from '@hapi/boom'
import { Router } from 'express-serve-static-core'

import { asyncMiddleware, checkRequiredParameters } from '../../utils'

const router = express.Router() as Router

const getLatestSemester = (ine: string): Promise<string> => new Promise((resolve, reject) => {
  const req = request('https://extra.univ-littoral.fr/abs/index.php', {
    method: 'POST',
    secureProtocol: 'TLSv1_method',
    ciphers: 'AES128-SHA',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, res => {
    let text = ''
    res.on('data', d => text += d)
    res.on('end', () => {
      if (res.statusCode && res.statusCode >= 400)
        return reject(new Error(`Received code ${res.statusCode}.`))
      else if (text.includes('Num&eacute;ro &eacute;tudiant inconnu'))
        return reject(new Error('Your student identifier was not found.'))

      // Find semesters <select> entries
      const semestersMatch = text.match(/option value=\"(.*)\"/)
      if (!semestersMatch || semestersMatch.length < 2)
        return reject(new Error('Could not get the semester list.'))
      resolve(semestersMatch[1])
    })
  })
  req.on('error', reject)
  req.write(`code_ine=${ine}&ok=Valider`)
  req.end()
})

const getMarks = (ine: string, semesterStr: string): Promise<string> => new Promise((resolve, reject) => {
  const req = request('https://extra.univ-littoral.fr/abs/index.php', {
    method: 'POST',
    secureProtocol: 'TLSv1_method',
    ciphers: 'AES128-SHA',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, res => {
    let text = ''
    res.on('data', d => text += d)
    res.on('end', () => {
      if (res.statusCode && res.statusCode >= 400)
        return reject(new Error(`Received code ${res.statusCode}.`))
      else if (text.includes('Num&eacute;ro &eacute;tudiant inconnu'))
        return reject(new Error('Your student identifier was not found.'))

      let marks = text
      try {
        marks = marks.split('remarques. </span></p>')[1]
          .split('</div></form>')[0]
          .replace(/�/g, 'é')
          .replace(/display\:\s?none;/g, '')
          .replace(/\<img src.*?\>/g, '')
          .replace(/\<td class=\"note_bold\">\&nbsp\<\/td\>/, '<td class="note_bold">Date</td>')
          .replace(/\<a href=\"#\" id=\"toggler\"\>[\s\S]*?\<\/a\>/, '')
          .replace(/onclick/g, '_onclick')
        resolve(marks)
      }
      catch {
        reject(boom.internal('Could not parse Scodoc marks.'))
      }
    })
  })
  req.on('error', reject)
  req.write(`code_ine=${ine}&sem=${semesterStr}`)
  req.end()
})

// Get student's marks
router.get('/scodoc/:ine', asyncMiddleware(async (req, res) => {
  const { ine } = checkRequiredParameters(['ine'], req.params)

  // Load marks
  const semesterStr = await getLatestSemester(ine)
  const marks = await getMarks(ine, semesterStr)

  // Custom HTML head
  const marksHead = `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    * {
      font-family: helvetica, arial, sans-serif;
      color: #444444;
      margin: 0;
      padding: 0;
    }
    h2 {
      font-size: 1.15em;
      padding: 8px;
    }
    .note_bold {
      color: #2f2f2f;
      font-weight: 600;
    }
    table, tr, td, th {
      border: 1px #c7c7c7 solid;
      border-collapse: collapse;
    }
    table {
      width: 100%;
    }
    td {
      font-size: 13px;
      padding: 5px;
    }
    .notes_bulletin_row_ue > td, .notes_bulletin_row_mod > td, .notes_bulletin_row_eval > td, .note {
      text-align: center;
    }
    .notes_bulletin_row_mod > td:nth-child(3), .notes_bulletin_row_eval > td:nth-child(4) {
      text-align: left;
    }
  </style>`

  res.json({
    data: `<html><head>${marksHead}</head><body>${marks}</body></html>`
  })
}))

export default router

const twoDigits = (serializable: any) => serializable.toString().padStart(2, '0')

/**
 * Transform a date object to a human-readable date format
 * `2019-12-31`
 * @param date Date to format
 * @returns formated date
 */
export const toHumanDate = (date: Date) => `${date.getFullYear()}-${(twoDigits(date.getMonth() + 1))}-${twoDigits(date.getDate())}`

/**
 * Transform a date object to a human-readable datetime format
 * `2019-12-31 - 24:60:60`
 * @param date Date to format
 * @returns formated datetime
 */
export const toHumanDateTime = (date: Date) => `${toHumanDate(date)} - ${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}:${twoDigits(date.getSeconds())}`

/**
 * Get a date's week number
 * @param date Date to parse
 * @see https://stackoverflow.com/a/34323944
 */
export const getDateWeek = (_date: Date) => {
  const date = new Date(_date)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
  const week1 = new Date(date.getFullYear(), 0, 4)
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}

/**
 * Remove accents from a string
 * @param str String to format
 */
export const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

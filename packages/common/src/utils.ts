/**
 * Transform a date object to a human-readable format
 * @param date Date to format
 */
export const toHumanDate = (date: Date) => date.toLocaleDateString('fr-FR')

/**
 * Transform a date object to a human-readable format
 * @param date Date to format
 */
export const toHumanDateTime = (date: Date) => date.toLocaleString('fr-FR').replace('à', '-')

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

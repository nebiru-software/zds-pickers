/* eslint-disable no-use-before-define */

import { compose } from 'redux'
import { isDefined, unary } from './utils'

export const asHtml = __html => ({ dangerouslySetInnerHTML: { __html } })

export const capitalize = s => isString(s) ? s.charAt(0).toUpperCase() + s.slice(1) : ''

export const extractLink = (value) => {
  const re = /[^<]*(<a href="([^"]+).*>([^<]+)<\/a>)/g
  const search = re.exec(value)

  const link = search && search.length === 4 ? search[2] : null
  const text = search && search.length === 4 ? search[3] : value
  return { link, text }
}

export const includesString = (s1) => {
  const S = String(s1).toUpperCase()
  return s2 => String(s2).toUpperCase().includes(S)
}

export const intToLetter = val => String.fromCharCode(64 + (toInt(val) % 26 || 1))

export const isEmptyString = value => !isDefined(value) || String(value).trim().length === 0

export const isJSON = (value) => {
  try {
    JSON.parse(value)
  } catch (e) {
    return false
  }
  return true
}

export const isString = value => typeof value === 'string'

export const prefix = frag => s => String(frag).concat(s)

export const pluralize = label => count => `${count} ${label}${count === 1 ? '' : label === 'class' ? 'es' : 's'}`

export const split = sep => (s = '') => String(s).split(sep)

export const suffix = frag => s => String(s).concat(frag)

export const toInt = unary(parseInt)

export const unwrap = frag => s => String(s).replace(new RegExp(`^${frag}|${frag}$`, 'g'), '')

export const wrap = (pre, suf = pre) => compose(
  prefix(pre),
  suffix(suf),
)

export const fieldRequired = value => (value ? undefined : 'Required')

const maxLength = max => value => (value && value.length > max ? `Must be ${max} characters or less` : undefined)

export const fieldMaxLength64 = maxLength(64)

export const fieldEmail = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined

export const fieldFilename = value => value && !/^[\w,\s-]+\.[A-Za-z]{3}$/i.test(value) ? 'Invalid filename' : undefined

export const validateFile = (file) => {
  let result = ''
  const fileMinSize = 1024
  const fileMaxSize = 1024 * 5

  if (file) {
    const { name, size } = file
    if (!name.endsWith('.txt')) {
      result = 'Settings files must use .txt extension'
    } else if (size < fileMinSize) {
      result = 'File must be at least 1Kb in size'
    } else if (size > fileMaxSize) {
      result = 'File cannot exceed 5Kb in size'
    }
  } else {
    result = 'Required'
  }

  return result
}

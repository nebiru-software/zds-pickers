/* eslint-disable no-use-before-define */

import { nanoid } from 'nanoid'
import { isDevEnv } from '../../selectors'
// import { compressToEncodedURIComponent } from 'lz-string'
// import { isDevEnv, isTestEnv } from '../../selectors'
// import { isObject } from './objects'

/* ---------------------------- URIs ---------------------------------------- */

// export const buildUrl = (uri, data = {}, encode = true) => {
//   const builtParams = buildUrlParams(data, encode)
//   return uri + (builtParams.length ? `?${builtParams}` : '')
// }

// export const buildUrlParams = (data, encode = true) => Object.entries(data)
//   .map(pair => pair.map(clean(encode)).join('='))
//   .join('&')

// const clean = encode => val => (isObject(val) || Array.isArray(val))
//   ? encode
//     ? compressToEncodedURIComponent(JSON.stringify(val))
//     : encodeURI(JSON.stringify(val))
//   : encodeURI(val)

/* ----------------------------  Misc --------------------------------------- */

export const appendScript = (config) => {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  document.head.appendChild(Object.assign(script, config))
}

export const assertId = id => id || `gen-${nanoid()}`

export const isMobile = () => navigator?.maxTouchPoints > 2

export const storage = () => isDevEnv() ? localStorage : sessionStorage

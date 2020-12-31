import { arraySequence } from './utils'

export const standardizeGroup = (name) => {
  switch (String(name).toLocaleLowerCase()) {
    case 'cymbals':
    case 'cymbal':
    case 'cym':
      return 'Cymbals'

    case 'hats':
    case 'hat':
    case 'hi-hat':
    case 'hi-hats':
      return 'Hats'

    case 'kicks':
    case 'kick':
      return 'Kicks'

    case 'perc':
    case 'percussion':
      return 'Perc'

    case 'rides':
    case 'ride':
      return 'Rides'

    case 'snares':
    case 'snare':
      return 'Snares'

    case 'toms':
    case 'tom':
    case 'tom-tom':
      return 'Toms'

    case 'aux':
    case 'auxillary':
      return 'aux'

    default:
      return name
  }
}

export const standardizeItem = ({ note, group, name }) => ({
  note,
  name,
  group: standardizeGroup(group),
})

export const reverse = content => content.map(({ note, group, name }) => `${note}:${group}|${name}`).join('\n')

const mapper = (raw, fillMissing = true) => {
  const availableNotes = raw
    .map((item) => {
      const props = /(\d+):([\w\s-]*)\|(.*)/.exec(item)

      return props
        ? {
          note: parseInt(props[1], 10),
          group: String(props[2]).trim(),
          name: String(props[3]).trim(),
        }
        : null
    })
    .filter(item => item !== null)
    .map(standardizeItem)

  // We may not have a complete set of 128 notes, so fill in the blanks
  return fillMissing
    ? arraySequence(128)
      .map(n => n + 1)
      .map(n => availableNotes.find(({ note }) => n === note) || {
        note: n,
        group: '',
        name: '',
      })
    : availableNotes
}

export const emptyMapping = () => mapper([], true)

export default mapper

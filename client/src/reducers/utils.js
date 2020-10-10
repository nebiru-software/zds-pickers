import { deepSortObject, get, omit } from '../core/fp/objects'
import { dedupe } from '../core/fp/arrays'

export const listReducerInitialState = () => ({ listed: [], loaded: [], metadata: null })

export const createReducer = (initialState, handlers) => (state = initialState, action) => Object
  .prototype
  .hasOwnProperty
  .call(handlers, action.type)
  // NOTE: external middleware reducers (such as router) will not appear to be sorted
  ? deepSortObject(handlers[action.type](state, action))
  : state

export const handleFetchListSuccess = (state, { response: { data, metadata, preserveListed } }) => {
  const listed = data.map(get('id'))
  return ({
    ...state,
    ...data.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
    metadata,
    // maintain existing ids (keeping natural sort order) when paginating
    listed: (preserveListed || metadata.offset)
      ? [...state.listed, ...listed]
      : listed,
    loaded: state.loaded.filter(id => !listed.includes(id)),
  })
}

export const updateLoaded = (state, item) => ({
  ...state,
  [item.id]: item,
  loaded: dedupe([...state.loaded, item.id]),
})

export const updateRemoved = (state, { id }) => ({
  ...omit(id)(state),
  listed: state.listed.filter(i => id !== i),
  loaded: state.listed.filter(i => id !== i),
})

import useAsyncFunction from '@studysync/react-redux-promise-listener-hook'
import promiseListener from 'core/promiseListener'

export const config = (actionType, resolveActionType) => ({
  reject: `${resolveActionType}_FAILURE`,
  resolve: `${resolveActionType}_SUCCESS`,
  start: actionType,
  setPayload: (action, args) => ({ ...action, ...args }),
  getError: action => action,
})

export default (actionType, resolveActionType) => {
  const asyncFunc = useAsyncFunction(
    config(actionType, resolveActionType || actionType),
    promiseListener,
  )

  return asyncFunc
}

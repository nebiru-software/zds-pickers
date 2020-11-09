import { useSelector } from 'react-redux'

export default (selector, ...params) => useSelector(state => selector(state, ...params))

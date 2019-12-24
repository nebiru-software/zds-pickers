import { useEffect, useState } from 'react'

export default (defaultVal) => {
  const [state, setState] = useState(defaultVal)

  useEffect(() => {
    setState(defaultVal)
  }, [defaultVal])

  return [state, setState]
}

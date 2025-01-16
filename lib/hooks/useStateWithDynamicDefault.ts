import { useEffect, useState } from 'react'

const useStateWithDynamicDefault = <T>(defaultVal: T) => {
  const [state, setState] = useState<T>(defaultVal)

  useEffect(() => {
    setState(defaultVal)
  }, [defaultVal])

  return [state, setState] as const
}

export default useStateWithDynamicDefault

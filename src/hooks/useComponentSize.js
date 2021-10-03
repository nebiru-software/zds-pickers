/* eslint-disable consistent-return */
import { useCallback, useLayoutEffect, useState } from 'react'

const getSize = el => el
  ? {
    width: el.offsetWidth,
    height: el.offsetHeight,
  }
  : {
    width: 0,
    height: 0,
  }

const useComponentSize = (ref) => {
  const [componentSize, setComponentSize] = useState(getSize(ref ? ref.current : {}))

  const handleResize = useCallback(() => {
    if (ref.current) {
      setComponentSize(getSize(ref.current))
    }
  }, [ref])

  useLayoutEffect(
    () => {
      if (!ref.current) return

      handleResize()

      if (typeof ResizeObserver === 'function') {
        let resizeObserver = new ResizeObserver(() => {
          handleResize()
        })
        resizeObserver.observe(ref.current)

        return () => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          resizeObserver.disconnect(ref.current)
          resizeObserver = null
        }
      }
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref.current],
  )

  return componentSize
}

export default useComponentSize

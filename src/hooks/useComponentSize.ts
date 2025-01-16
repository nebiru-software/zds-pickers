import { useCallback, useLayoutEffect, useState } from 'react'

const getSize = (el: HTMLDivElement | null) =>
  el
    ? {
        width: el.offsetWidth,
        height: el.offsetHeight,
      }
    : {
        width: 0,
        height: 0,
      }

const useComponentSize = (ref: React.RefObject<HTMLDivElement>) => {
  const [componentSize, setComponentSize] = useState(
    getSize(ref ? ref.current : null),
  )

  const handleResize = useCallback(() => {
    if (ref.current) {
      setComponentSize(getSize(ref.current))
    }
  }, [ref])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    if (!ref.current) return

    handleResize()

    if (typeof ResizeObserver === 'function') {
      const resizeObserver = new ResizeObserver(() => {
        handleResize()
      })
      resizeObserver.observe(ref.current)

      return () => {
        resizeObserver.disconnect()
        // resizeObserver = null
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [ref.current])

  return componentSize
}

export default useComponentSize

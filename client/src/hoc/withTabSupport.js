import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default (WrappedComponent) => {
  const Enhanced = ({ className, ...rest }) => {
    const [enabled, setEnabled] = useState(false)

    const handleKeyDown = ({ key }) => {
      if (key === 'Tab') {
        setEnabled(true)
      }
    }

    const handleMouseDown = () => setEnabled(false)

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleMouseDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('mousedown', handleMouseDown)
      }
    }, [])

    return (
      <WrappedComponent
        className={classNames({ [className]: true, 'tab-mode-enabled': enabled })}
        {...rest}
      />
    )
  }
  Enhanced.propTypes = { className: PropTypes.string }
  Enhanced.defaultProps = { className: null }

  return Enhanced
}

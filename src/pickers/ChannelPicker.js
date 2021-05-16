import { forwardRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import cl from 'classnames'
import { arraySequence } from '../utils'
import Select from './Select'

const options = arraySequence(16).map(value => ({
  value,
  label: `Channel ${value + 1}`,
}))

const ChannelPicker = forwardRef(({ className, ...rest }, ref) => {
  const formatOptionLabel = useCallback(
    (option, { context }) => context === 'value'
      ? option.label
      : option.value + 1,
    [],
  )
  return (
    <Select
      {...rest}
      className={cl(className, 'channel-picker')}
      formatOptionLabel={formatOptionLabel}
      options={options}
      ref={ref}
    />
  )
})

ChannelPicker.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

ChannelPicker.defaultProps = {
  className: undefined,
}

export default ChannelPicker

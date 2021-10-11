import React, { forwardRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { getStockNames, getUserMappingNames } from 'zds-mappings'
import Select from './Select'

const MappingPicker = forwardRef(({ allowClearing, ...rest }, ref) => {
  const stockMappings = getStockNames()
  const userMappings = getUserMappingNames()

  const options = useMemo(() => {
    const result = allowClearing
      ? [{
        value: -1,
        label: <span className="zds-mappings-clear-mapping">No Mapping</span>,
      }]
      : []

    return [
      ...result,

      {
        label: allowClearing ? <hr /> : '',
        options: userMappings.map(label => ({ value: label, label: <span className="zds-mappings-user-mapping">{label}</span> })),
      },

      {
        label: userMappings.length
          ? <hr />
          : allowClearing ? <hr /> : '',
        options: stockMappings.map(label => ({ label, value: label })),
      },
    ]
  }, [allowClearing, stockMappings, userMappings])

  return (
    <Select
      {...rest}
      options={options}
      ref={ref}
    />
  )
})

MappingPicker.propTypes = {
  allowClearing: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

MappingPicker.defaultProps = {
  allowClearing: true,
  value: 'General MIDI',
}

export default MappingPicker

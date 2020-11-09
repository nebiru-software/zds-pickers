import React from 'react'
import PropTypes from 'prop-types'
import GridControls from './entries/GridControls'
import GridHeader from './entries/GridHeader'
import ShiftEntriesGrid from './entries/ShiftEntriesGrid'

const ShiftGroup = ({ groupId }) => (
  <section>
    <GridControls groupId={groupId} />
    <GridHeader groupId={groupId} />
    <ShiftEntriesGrid groupId={groupId} />
  </section>
)

ShiftGroup.propTypes = { groupId: PropTypes.number.isRequired }

export default ShiftGroup

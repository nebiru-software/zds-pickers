import React from 'react'
import GridControls from './entries/GridControls'
import GridHeader from './entries/GridHeader'
import ShiftEntriesGrid from './entries/ShiftEntriesGrid'

const ShiftGroup = props => (
  <section>
    <GridControls {...props} />
    <GridHeader {...props} />
    <ShiftEntriesGrid {...props} />
  </section>
)

export default ShiftGroup

import React from 'react'
import PropTypes from 'prop-types'
import { SORT_BY_ALL, SORT_BY_CHANNEL, SORT_BY_MESSAGE, SORT_BY_VALUE } from '../../core/consts'
import { gridHeader } from '../../styles/shiftGroupHeader.scss'
import { getShiftGroup } from '../../selectors/shiftGroups'
import useParamSelector from '../../hooks/useParamSelector'
import SortControls from './SortControls'

const GridHeader = ({ groupId }) => {
  const group = useParamSelector(getShiftGroup, groupId)
  if (!group) { return false }

  const { sortBy, sortDir, sortOn } = group
  const sortProps = {
    groupId,
    sortBy,
    sortDir,
    sortOn,
  }

  return (
    <div className={gridHeader}>
      <header>
        <section>
          <SortControls
            field={SORT_BY_ALL}
            {...sortProps}
            isInput
          >
            Input
          </SortControls>
        </section>
        <section>
          <SortControls
            field={SORT_BY_ALL}
            {...sortProps}
          >
            Output
          </SortControls>
        </section>
      </header>

      <footer>
        <section>
          <div>
            <SortControls
              field={SORT_BY_MESSAGE}
              {...sortProps}
              isInput
            >
              Message
            </SortControls>
          </div>
          <div>
            <SortControls
              field={SORT_BY_CHANNEL}
              {...sortProps}
              isInput
            >
              Channel
            </SortControls>
          </div>
          <div>
            <SortControls
              field={SORT_BY_VALUE}
              {...sortProps}
              isInput
            >
              Value
            </SortControls>
          </div>
        </section>
        <section>
          <div>
            <SortControls
              field={SORT_BY_MESSAGE}
              {...sortProps}
            >
              Message
            </SortControls>
          </div>
          <div>
            <SortControls
              field={SORT_BY_CHANNEL}
              {...sortProps}
            >
              Channel
            </SortControls>
          </div>
          <div>
            <SortControls
              field={SORT_BY_VALUE}
              {...sortProps}
            >
              Value
            </SortControls>
          </div>
        </section>
      </footer>
    </div>
  )
}

GridHeader.propTypes = {
  groupId: PropTypes.number.isRequired,
}

export default GridHeader

import React from 'react'
import PropTypes from 'prop-types'
import { SORT_BY_ALL, SORT_BY_CHANNEL, SORT_BY_MESSAGE, SORT_BY_VALUE } from '../../core/consts'
import { gridHeader } from '../../styles/shiftGroupHeader.scss'
import { sortShape } from '../../core/shapes'
import SortControls from './SortControls'

const GridHeader = props => (
  <div className={gridHeader}>
    <header>
      <section>
        <SortControls
          field={SORT_BY_ALL}
          {...props}
          isInput
        >
          Input
        </SortControls>
      </section>
      <section>
        <SortControls
          field={SORT_BY_ALL}
          {...props}
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
            {...props}
            isInput
          >
            Message
          </SortControls>
        </div>
        <div>
          <SortControls
            field={SORT_BY_CHANNEL}
            {...props}
            isInput
          >
            Channel
          </SortControls>
        </div>
        <div>
          <SortControls
            field={SORT_BY_VALUE}
            {...props}
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
            {...props}
          >
            Message
          </SortControls>
        </div>
        <div>
          <SortControls
            field={SORT_BY_CHANNEL}
            {...props}
          >
            Channel
          </SortControls>
        </div>
        <div>
          <SortControls
            field={SORT_BY_VALUE}
            {...props}
          >
            Value
          </SortControls>
        </div>
      </section>
    </footer>
  </div>
)

GridHeader.propTypes = {
  groupId: PropTypes.number.isRequired,
  ...sortShape,
  changeSort: PropTypes.func.isRequired,
}

export default GridHeader

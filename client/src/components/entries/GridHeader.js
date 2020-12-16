import PropTypes from 'prop-types'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { border, padding } from 'polished'
import { SORT_BY_ALL, SORT_BY_CHANNEL, SORT_BY_MESSAGE, SORT_BY_VALUE } from 'core/consts'
import { getShiftGroup } from 'selectors/shiftGroups'
import useParamSelector from 'hooks/useParamSelector'
import SortControls from './SortControls'

const useStyles = makeStyles(({ mixins: { absWidth }, palette }) => ({
  root: {
    backgroundColor: palette.common.white,
    textAlign: 'center',

    '& a': {
      color: palette.text.dimmer,
      textDecoration: 'none',
    },

    '& header, & footer': {
      ...border('bottom', 1, 'solid', palette.text.primary),
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'space-around',

      '& section': {
        width: '50%',
        ...padding(4, 0),
        boxSizing: 'border-box',
      },

      '& section:first-child': border('right', 1, 'solid', palette.text.primary),
    },

    '& header': {
      fontWeight: 'bold',
    },

    '& footer': {
      '& section': {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'space-around',

        '& > div:first-of-type': {
          // Message
          ...absWidth(100),
          textAlign: 'center',
        },

        '& > div:nth-of-type(2)': {
          // Channel
          ...absWidth(75),
        },
        '& > div:nth-of-type(3)': {
          // Value
          ...absWidth(160),
          textAlign: 'left',
        },
      },

      '& section:first-child': padding(0, 25, 0, 55),
      '& section:nth-child(2)': padding(0, 37, 0, 30),
    },
  },
}), { name: 'GridHeader' })

const GridHeader = ({ groupId }) => {
  const classes = useStyles()
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
    <div className={classes.root}>
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

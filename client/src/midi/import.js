/* eslint-disable no-plusplus */
import PromiseFileReader from 'promise-file-reader'
import Hash from 'object-hash'
import { actions as shifterActions } from '../reducers/shifter'
import { chunk } from '../core/fp/arrays'
import { delay } from '../core/fp/utils'
import { transmitBackup } from './sysexOutput'

/*
 * The "proper" way to do this would be to let the reducers pick out the pieces
 * they're interested in.
 * The trouble with that is that it would bombard the hardware with a flurry of
 * SysEx messages.
 *
 * Instead, let's extricate the controls and groups and then transmit them to
 * the hardware in bulk.  This causes a reset which will pump the data into
 * our reducers via the normal means.
 */

const validFile = ([fileChecksum, ...rest]) => Hash(rest) === fileChecksum
const invalidFile = dispatch => dispatch(shifterActions.settingsFileInvalid('Invalid settings file'))

// Params are hash, version, proModel, then the rest
const process = (dispatch, [, , , ...rest]) => new Promise((resolve, reject) => {
  const BLOCK_SIZE = 51
  try {
    chunk(BLOCK_SIZE)(rest).forEach((block, blockIdx) => {
      delay(200)

      transmitBackup(
        dispatch, //
        [blockIdx, BLOCK_SIZE, block.length, ...block],
      )
    })

    resolve()
  } catch (e) {
    // istanbul ignore next
    reject(e)
  }
})

export default ({ dispatch }, { File }) => PromiseFileReader.readAsText(File, 'UTF-8')
  .then(rawText => rawText.trim().split(' '))
  .then(data => data.map((value, idx) => (idx === 0 ? value : Number(value))))
  .then(data => (validFile(data) ? process(dispatch, data) : invalidFile(dispatch)))
  .catch(/* istanbul ignore next */ () => invalidFile(dispatch))

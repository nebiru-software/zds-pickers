import { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import Busy from '../../../Busy'

const ReactQuill = lazy(() => import('./RichText'))

const RichTextEditor = props => (
  <Suspense fallback={<Busy />}>
    <ReactQuill {...props} />
  </Suspense>
)

RichTextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default RichTextEditor

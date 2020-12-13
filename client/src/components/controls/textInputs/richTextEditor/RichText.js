import RichText from 'react-quill'
import { formats, modules } from './reactQuillToolbar'

export default props => (
  <RichText
    formats={formats}
    modules={modules}
    theme="snow"
    {...props}
  />
)

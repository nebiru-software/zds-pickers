import PropTypes from 'prop-types'
import FileInput from '../FileInput'
import { validateFile } from '../../core/fp/strings'

const ImportSettingsForm = ({ handleSubmit }) => (
  <div>
    <form onSubmit={handleSubmit}>
      <FileInput
        label="Filename"
        name="importFilename"
        validate={[validateFile]}
      />
    </form>
  </div>
)

ImportSettingsForm.propTypes = {
  handleSubmit: PropTypes.func,
}

ImportSettingsForm.defaultProps = {
  handleSubmit: null,
}

export default ImportSettingsForm

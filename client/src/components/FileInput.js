import PropTypes from 'prop-types'
import { useState } from 'react'
import { validateFile } from 'fp/strings'

const FileInput = ({ onReady, ...rest }) => {
  const [errorMsg, setErrorMsg] = useState('')

  const handleFileSelected = ({ target }) => {
    const result = validateFile(target.files[0])
    onReady(result === '' ? target.files[0] : undefined)
    setErrorMsg(result)
  }

  return (
    <div>
      <input
        accept="text/plain"
        onBlur={handleFileSelected}
        onChange={handleFileSelected}
        type="file"
        {...rest}
      />
      <p>{errorMsg}</p>
    </div>
  )
}

FileInput.propTypes = {
  onReady: PropTypes.func.isRequired,
}

export default FileInput

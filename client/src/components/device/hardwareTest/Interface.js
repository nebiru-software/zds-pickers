import React from 'react'
import { hardwareTestShape } from '../../../shapes'
import Connected from './Connected'
import FactoryReset from './FactoryReset'
import SendEntries from './SendEntries'
import SendMessages from './SendMessages'
import Done from './Done'

const stepContent = {
  0: Connected,
  1: FactoryReset,
  2: SendEntries,
  3: SendMessages,
  4: Done,
}

const Interface = (props) => {
  const { hardwareTest: { step } } = props

  const ContentComponent = stepContent[step]

  return (
    <div>
      <section>
        <div style={{ margin: '0 5px' }}>
          <ContentComponent {...props} />
        </div>
      </section>
    </div>
  )
}

Interface.propTypes = {
  hardwareTest: hardwareTestShape.isRequired,
}

export default Interface

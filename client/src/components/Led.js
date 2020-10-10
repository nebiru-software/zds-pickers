import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from '../styles/midiActivity.scss'

const Led = ({ label, lit, isMidiActivity, layout }) => {
  const className = classNames({
    [styles.led]: !lit && !isMidiActivity,
    [styles.ledBlink]: lit && !isMidiActivity,
    [styles.ledPower]: !lit && isMidiActivity,
    [styles.ledPowerBlink]: lit && isMidiActivity,
  })
  return (
    <figure
      className={styles.midiActivity}
      style={{ justifyContent: layout === 'left' ? 'flex-start' : 'flex-end' }}
    >
      {layout === 'right' && <header>{label}</header>}
      <div className={className} />
      {layout === 'left' && <header>{label}</header>}
    </figure>
  )
}

Led.propTypes = {
  label: PropTypes.string.isRequired,
  lit: PropTypes.bool.isRequired,
  isMidiActivity: PropTypes.bool,
  layout: PropTypes.oneOf(['left', 'right']),
}
Led.defaultProps = {
  isMidiActivity: false,
  layout: 'left',
}

export default Led

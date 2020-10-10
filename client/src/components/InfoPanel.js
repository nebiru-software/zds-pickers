import React from 'react'
import { connect } from 'react-redux'
import styles from '../styles/infoPanel.scss'
import { versionShape } from '../shapes'

export const InfoPanel = ({ version }) => {
  const { client, firmware } = version
  const formatted = value => (Number.isNaN(value) ? 'N/A' : `v${(value / 10).toFixed(1)}`)
  const year = () => new Date().getFullYear()
  const foundVersion = () => formatted(firmware)

  return (
    <footer className={styles.infoPanel}>
      <div className={styles.copyright}>
        &copy; Copyright <a href="https://zendrumstudio.com">Zendrum Studio</a>, {year()}
      </div>
      <div className={styles.versions}>
        <span className={styles.version}>Client: {formatted(client)}</span>
        <span className={styles.version}>Firmware: {foundVersion()}</span>
      </div>
    </footer>
  )
}

InfoPanel.propTypes = {
  version: versionShape.isRequired,
}

export const mapStateToProps = ({ version }) => ({ version })

export default connect(mapStateToProps)(InfoPanel)

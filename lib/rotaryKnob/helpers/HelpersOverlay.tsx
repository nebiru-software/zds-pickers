import React from 'react'
import ReactDOM from 'react-dom'

type HelpersOverlayProps = React.PropsWithChildren & {
  overlayStyle?: React.CSSProperties
}

/**
 * Draws the overlay and the children
 */
class HelpersOverlay extends React.Component<HelpersOverlayProps> {
  render() {
    const { children, ...rest } = this.props

    const styles = {
      overlay: Object.assign(
        {
          width: '100%',
          height: '100vh',
          top: 0,
          left: 0,
          zIndex: 2147483647,
          margin: '0',
          padding: '0',
          boxSizing: 'border-box',
          position: 'fixed',
        },
        this.props.overlayStyle,
      ),
    }

    return ReactDOM.createPortal(
      <div
        style={styles.overlay}
        {...rest}>
        {children}
      </div>,
      document.body,
    )
  }
}

export { HelpersOverlay }

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Divider from '@material-ui/core/Divider'
import MenuIcon from '@material-ui/icons/Menu'
import PermIdentity from '@material-ui/icons/PermIdentity'
import FileDownload from '@material-ui/icons/GetApp'
import FileUpload from '@material-ui/icons/CloudUpload'
import Warning from '@material-ui/icons/Warning'
import { actions as userActions } from '../reducers/user'
import { actions as shifterActions } from '../reducers/shifter'
import { shifterShape } from '../shapes'
import ExportSettings from './file/ExportSettings'
import ImportSettings from './file/ImportSettings'
import FactoryReset from './FactoryReset'

export class MainMenu extends Component {
  state = {
    anchorEl: null,
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const {
      confirmFactoryReset,
      performFactoryReset,
      shifter,
      shifter: { ready, found, responding },
      showDialog,
      showExportDialog,
      showImportDialog,
    } = this.props
    const { anchorEl } = this.state

    const open = Boolean(anchorEl)

    return ready ? (
      <>
        <IconButton
          aria-haspopup="true"
          aria-label="More"
          aria-owns={open ? 'long-menu' : null}
          onClick={this.handleClick}
        >
          <Tooltip
            title="Settings"
          >
            <MenuIcon />
          </Tooltip>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="long-menu"
          onClick={this.handleClose}
          onClose={this.handleClose}
          open={open}
          PaperProps={{
            style: {
              width: 200,
            },
          }}
        >
          <MenuItem
            icon="perm_identity"
            onClick={showDialog}
            tag="miRegistration"
            value="user"
          >
            <ListItemIcon>
              <PermIdentity />
            </ListItemIcon>
            <ListItemText
              inset
              primary="Registration"
            />
          </MenuItem>

          <Divider />

          <MenuItem
            disabled={!(found && responding)}
            onClick={() => showExportDialog(true)}
            tag="miExport"
          >
            <ListItemIcon>
              <FileDownload />
            </ListItemIcon>
            <ListItemText
              inset
              primary="Backup Settings"
            />
          </MenuItem>

          <MenuItem
            disabled={!(found && responding)}
            onClick={() => showImportDialog(true)}
            tag="miImport"
          >
            <ListItemIcon>
              <FileUpload />
            </ListItemIcon>
            <ListItemText
              inset
              primary="Restore Settings"
            />
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={() => confirmFactoryReset(true)}
            tag="miReset"
            value="reset"
          >
            <ListItemIcon>
              <Warning />
            </ListItemIcon>
            <ListItemText
              inset
              primary="Factory Reset"
            />
          </MenuItem>
        </Menu>

        <ExportSettings />
        <ImportSettings />

        <FactoryReset
          confirmFactoryReset={confirmFactoryReset}
          performFactoryReset={performFactoryReset}
          shifter={shifter}
        />
      </>
    ) : null
  }
}

MainMenu.propTypes = {
  shifter: shifterShape.isRequired,
  showDialog: PropTypes.func.isRequired,
  confirmFactoryReset: PropTypes.func.isRequired,
  performFactoryReset: PropTypes.func.isRequired,
  showImportDialog: PropTypes.func.isRequired,
  showExportDialog: PropTypes.func.isRequired,
}

export const mapStateToProps = ({ shifter }) => ({ shifter })
export const mapDispatchToProps = dispatch => bindActionCreators({ ...userActions, ...shifterActions }, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainMenu)

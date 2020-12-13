import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Divider from '@material-ui/core/Divider'
import MenuIcon from '@material-ui/icons/Menu'
import PermIdentity from '@material-ui/icons/PermIdentity'
import FileDownload from '@material-ui/icons/GetApp'
import FileUpload from '@material-ui/icons/CloudUpload'
import Warning from '@material-ui/icons/Warning'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { stateShifter } from 'selectors/index'
import { actions as shifterActions } from 'reducers/shifter'
import ExportSettings from './file/ExportSettings'
import ImportSettings from './file/ImportSettings'
import FactoryReset from './FactoryReset'
import UserRegistration from './user/UserRegistration'

const MainMenu = () => {
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState()
  const [dialogVisible, setDialogVisible] = useState(false)
  const { found, ready, responding } = useSelector(stateShifter)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return ready ? (
    <>
      <IconButton
        aria-haspopup="true"
        aria-label="More"
        aria-owns={open ? 'long-menu' : null}
        onClick={handleClick}
      >
        <Tooltip title="Settings">
          <MenuIcon />
        </Tooltip>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="long-menu"
        onClick={handleClose}
        onClose={handleClose}
        open={open}
        PaperProps={{
          style: {
            width: 200,
          },
        }}
      >
        <MenuItem
          icon="perm_identity"
          onClick={() => setDialogVisible(true)}
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
          onClick={() => dispatch(shifterActions.showExportDialog(true))}
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
          onClick={() => dispatch(shifterActions.showImportDialog(true))}
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
          onClick={() => dispatch(shifterActions.confirmFactoryReset(true))}
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

      <FactoryReset />

      <UserRegistration
        active={dialogVisible}
        hideDialog={() => setDialogVisible(false)}
      />
    </>
  ) : null
}

export default MainMenu

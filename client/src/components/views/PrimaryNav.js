import React from 'react'
import UserInfo from '../user/UserInfo'
import MainMenu from '../MainMenu'
import Logo from '../../images/shifter.svg'
import EditEntryDlg from '../entries/EditEntryDlg'
import ErrorDialog from '../ErrorDialog'
import { mainContent, topBar } from '../../styles/primaryNav.scss'
import Documentation from '../Documentation'
import ShiftGroups from './ShiftGroups'
import InputControls from './InputControls'

const PrimaryNav = () => (
  <div>
    <div className={topBar}>
      <Logo />
      <section>
        <UserInfo />
        <Documentation />
        <MainMenu />
      </section>
    </div>

    <section className={mainContent}>
      <InputControls />
      <ShiftGroups />
      <EditEntryDlg />
      <ErrorDialog />
    </section>
  </div>
)

export default PrimaryNav

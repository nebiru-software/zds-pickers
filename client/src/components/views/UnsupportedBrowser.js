import makeStyles from '@material-ui/core/styles/makeStyles'
import { margin } from 'polished'
import ChromeIcon from 'images/Chrome.svg'
import OperaIcon from 'images/Opera.svg'

const useStyles = makeStyles(({ mixins: { rem }, palette }) => ({
  outer: {
    height: '100%',
    padding: 0,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  main: {
    height: '100vh',
    maxWidth: 600,
    margin: 5,
    textAlign: 'center',

    '& a, & a:visited': {
      ...margin(10, 0, 3),
      fontSize: rem(2),
      color: '#7777ff',
      textDecoration: 'none',
    },

    '& header': {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',

      '& a, & a:visited': {
        color: palette.text.greyed,
        textDecoration: 'underline',
        fontSize: rem(1.5),
      },
    },

    '& h1': {
      fontSize: rem(3.8),
    },

    '& p': {
      fontSize: rem(1.8),
    },

    '& footer': {
      display: 'flex',
      flexFlow: 'row nowrap',

      '& section': {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        marginTop: 20,
      },
    },
  },
}), { name: 'UnsupportedBrowser' })

const UnsupportedBrowser = () => {
  const classes = useStyles()
  return (
    <div className={classes.outer}>
      <div className={classes.main}>
        <header>
          <a href="https://zendrumstudio.com">zendrumstudio.com</a>
          <a href="https://zendrumstudio.com/support/contact">Contact Us</a>
        </header>
        <h1>Unsupported browser</h1>
        <p>
          This application makes use of bleeding edge web technologies in order
          to communicate with your ZDS Shifter over MIDI and USB.
        </p>
        <p>At this time, only these browsers support this emerging web technology.</p>

        <footer>
          <section>
            <a href="https://www.google.com/chrome/browser/">
              <ChromeIcon width="50%" />
            </a>
            <a href="https://www.google.com/chrome/browser/">Google Chrome</a>
            <aside>Version 43+</aside>
          </section>
          <section>
            <a href="https://www.opera.com/download">
              <OperaIcon width="50%" />
            </a>
            <a href="https://www.opera.com/download">Opera</a>
            <aside>Version 33+</aside>
          </section>
        </footer>
      </div>
    </div>
  )
}

export default UnsupportedBrowser

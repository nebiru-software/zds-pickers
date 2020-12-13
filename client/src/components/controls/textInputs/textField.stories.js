import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import styled from '@material-ui/core/styles/styled'
import { withStore } from '../../../../../.storybook/decorators'
import TextField from './TextField'

export default { title: 'Components/Form Controls/Text/TextField', decorators: [withStore()] }

export const samples = () => {
  const Render = styled(props => (
    <div {...props}>
      <Typography variant="h4">Standard</Typography>
      <Grid container>
        <TextField
          defaultValue="username"
          label="Required"
          required
        />
        <TextField
          defaultValue="previous value"
          disabled
          label="Disabled"
        />
        <TextField
          autoComplete="current-password"
          label="Password"
          type="password"
        />
        <TextField
          defaultValue="Cannot edit"
          InputProps={{
            readOnly: true,
          }}
          label="Read Only"
        />
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="Number"
          type="number"
        />
        <TextField
          label="Search field"
          type="search"
        />
        <TextField
          defaultValue="Default Value"
          helperText="Some important text"
          label="Helper text"
        />
      </Grid>

      <Typography variant="h4">Outlined</Typography>
      <Grid container>
        <TextField
          defaultValue="username"
          label="Required"
          required
          variant="outlined"
        />
        <TextField
          defaultValue="previous value"
          disabled
          label="Disabled"
          variant="outlined"
        />
        <TextField
          autoComplete="current-password"
          label="Password"
          type="password"
          variant="outlined"
        />
        <TextField
          defaultValue="Cannot edit"
          InputProps={{
            readOnly: true,
          }}
          label="Read Only"
          variant="outlined"
        />
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="Number"
          type="number"
          variant="outlined"
        />
        <TextField
          label="Search field"
          type="search"
          variant="outlined"
        />
        <TextField
          defaultValue="Default Value"
          helperText="Some important text"
          label="Helper text"
          variant="outlined"
        />
      </Grid>

      <p>
        See{' '}
        <a
          href="https://material-ui.com/components/text-fields/"
          rel="noopener noreferrer"
          target="_blank"
        >
          https://material-ui.com/components/text-fields/
        </a>{' '}
        for more examples and variants.
      </p>
    </div>
  ))(({ theme: { mixins: { rem } } }) => ({
    '& h4:not(:first-child)': {
      marginTop: rem(3),
    },
    '& .MuiTextField-root': {
      margin: rem(1),
      width: 200,
    },
  }))

  return <Render />
}

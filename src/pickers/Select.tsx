import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useMemo,
} from 'react'
import ReactSelect, {
  type GroupBase,
  type IndicatorsContainerProps,
  components as originalComponents,
  type PlaceholderProps,
  type SelectInstance,
  type SingleValue,
  type StylesConfig,
  type ValueContainerProps,
} from 'react-select'
import { omit } from '../utils.ts'

const { IndicatorsContainer, Placeholder, ValueContainer } = originalComponents

type Option = {
  label: React.ReactNode
  value: number | string
}

interface CustomIndicatorsContainerProps
  extends Omit<IndicatorsContainerProps<Option, false>, 'selectProps'> {
  children: React.ReactNode
  selectProps: IndicatorsContainerProps<Option, false>['selectProps'] & {
    actionButton?: React.ReactNode
    inputValue?: string
    placeholder?: React.ReactNode
  }
}

const CustomIndicatorsContainer = ({
  children,
  ...rest
}: CustomIndicatorsContainerProps) => {
  const actionButton = rest.selectProps?.actionButton

  return (
    <IndicatorsContainer {...rest}>
      <div
        onMouseDown={e => {
          e.stopPropagation()
          e.preventDefault()
        }}
        style={{ display: 'flex' }}>
        {actionButton}
        {children}
      </div>
    </IndicatorsContainer>
  )
}

type CustomValueContainerProps = (
  | ValueContainerProps<Option, false>
  | PlaceholderProps<Option, false>
) & {
  children: React.ReactNode
  hasValue?: boolean
  isFocused?: boolean
}

const CustomValueContainer = ({
  children,
  ...props
}: CustomValueContainerProps) => (
  <ValueContainer {...props}>
    <Placeholder
      {...props}
      innerProps={props.innerProps || {}}
      className={props.hasValue || props.selectProps.inputValue ? 'shrunk' : ''}
      isFocused={props.isFocused ?? false}>
      {props.selectProps.placeholder}
    </Placeholder>
    {Children.map(children, child =>
      isValidElement(child) && child.type !== Placeholder ? child : null,
    )}
  </ValueContainer>
)

type SelectProps = {
  className?: string
  components?: object
  disabled?: boolean
  formatOptionLabel?: (
    option: Option,
    { context }: { context: 'menu' | 'value' },
  ) => React.ReactNode
  isSearchable?: boolean
  label?: string
  onChange: (value: Option['value']) => void
  options: Option[] | { entries: Option[] }[]
  preserveMenuWidth?: boolean
  shrinkLabel?: boolean
  value: Option['value']
}

type SelectRef = SelectInstance<Option, false, GroupBase<Option>>

const Select = forwardRef<SelectRef, SelectProps>((props, ref) => {
  const {
    components,
    disabled,
    label,
    onChange,
    options,
    preserveMenuWidth,
    shrinkLabel,
    value,
    ...rest
  } = props

  const handleChange = useCallback(
    (option: SingleValue<Option>) => {
      if (option) {
        onChange(option.value)
      }
    },
    [onChange],
  )

  const flatOptionsList = options.reduce<Option[]>((acc, entry) => {
    if ('entries' in entry) {
      return acc.concat(entry.entries)
    }
    return acc.concat(entry)
  }, [])

  const selectedOption =
    flatOptionsList.find(option => value === option.value) || undefined

  const styles: unknown = useMemo(() => {
    const base = preserveMenuWidth
      ? {
          menu: (base: Record<string, unknown>) => omit('width')(base),
          menuList: (base: object) => ({
            ...base,
            overflowX: 'hidden',
          }),
          option: (base: object) => ({
            ...base,
            whiteSpace: 'nowrap',
            paddingRight: 10,
          }),
        }
      : {}

    return shrinkLabel
      ? {
          ...base,
          container: (provided: object /* , state */) => ({
            ...provided,
            marginTop: 10,
          }),
          placeholder: (
            _provided: object,
            state: PlaceholderProps<Option, false>,
          ) => ({
            position: 'absolute',
            left: state.hasValue || state.selectProps.inputValue ? -2 : '4%',
            top: state.hasValue || state.selectProps.inputValue ? -12 : '50%',
            transition: 'top 0.1s, font-size 0.1s, color 0.1s',
            fontSize: (state.hasValue || state.selectProps.inputValue) && 13,
          }),
          valueContainer: (provided: object /* , state */) => ({
            ...provided,
            overflow: 'visible',
          }),
        }
      : {
          ...base,
        }
  }, [preserveMenuWidth, shrinkLabel])

  return shrinkLabel ? (
    <div className="zds-pickers__container">
      <ReactSelect
        {...rest}
        classNamePrefix="zds-pickers"
        components={{
          IndicatorsContainer: CustomIndicatorsContainer,
          ValueContainer: CustomValueContainer,
          ...components,
        }}
        isDisabled={disabled}
        onChange={handleChange}
        options={flatOptionsList}
        placeholder={label}
        ref={ref}
        styles={styles as StylesConfig<Option, false, GroupBase<Option>>}
        value={selectedOption}
      />
    </div>
  ) : (
    <div className="zds-pickers__container">
      {Boolean(label) && <span className="zds-pickers__label">{label}</span>}
      <ReactSelect
        {...rest}
        classNamePrefix="zds-pickers"
        components={{
          IndicatorsContainer: CustomIndicatorsContainer,
          ...components,
        }}
        isDisabled={disabled}
        onChange={handleChange}
        options={flatOptionsList}
        ref={ref}
        styles={styles as StylesConfig<Option, false, GroupBase<Option>>}
        value={selectedOption}
      />
    </div>
  )
})

export default Select

export type { Option, SelectProps, SelectRef }

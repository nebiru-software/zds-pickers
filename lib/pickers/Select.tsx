import {
  Children,
  type JSX,
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
  type SelectComponentsConfig,
  type SelectInstance,
  type SingleValue,
  type StylesConfig,
  type ValueContainerProps,
} from 'react-select'
import { omit } from '../utils'

const { IndicatorsContainer, Placeholder, ValueContainer } = originalComponents

type PassedSelectProps = {
  actionButton?: React.ReactNode
  inputValue?: string
  placeholder?: React.ReactNode
}

type Option<T> = {
  label: React.ReactNode
  value: T
}

interface CustomIndicatorsContainerProps<T>
  extends Omit<IndicatorsContainerProps<Option<T>, false>, 'selectProps'> {
  children: React.ReactNode
  selectProps: IndicatorsContainerProps<Option<T>, false>['selectProps'] &
    PassedSelectProps
}

const CustomIndicatorsContainer = <T,>(
  props: CustomIndicatorsContainerProps<T>,
) => {
  const { children, ...rest } = props
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

type CustomValueContainerProps<T> = (
  | ValueContainerProps<Option<T>, false>
  | PlaceholderProps<Option<T>, false>
) & {
  children: React.ReactNode
  hasValue?: boolean
  isFocused?: boolean
}

const CustomValueContainer = <T,>({
  children,
  ...props
}: CustomValueContainerProps<T>) => (
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

type SelectProps<T> = SelectComponentsConfig<
  Option<T>,
  false,
  GroupBase<Option<T>>
> & {
  actionButton?: React.ReactNode
  className?: string
  components?: object
  disabled?: boolean
  filterOptions?: (candidate: Option<T>, inputValue: string) => boolean
  formatOptionLabel?: (
    option: Option<unknown>,
    { context }: { context: 'menu' | 'value' },
  ) => React.ReactNode
  isSearchable?: boolean
  label?: string
  menuPortalTarget?: HTMLElement | null
  menuPosition?: 'fixed' | 'absolute'
  menuShouldScrollIntoView?: boolean
  onChange: (value: Option<T>['value']) => void
  options: Option<T>[] | { entries: Option<T>[] }[]
  preserveMenuWidth?: boolean
  selectProps?: PassedSelectProps
  shrinkLabel?: boolean
  value?: Option<T>['value']
}

const Select = forwardRef(
  <T,>(
    props: SelectProps<T>,
    ref: React.ForwardedRef<
      SelectInstance<Option<T>, false, GroupBase<Option<T>>>
    >,
  ) => {
    const {
      components,
      disabled,
      label,
      onChange,
      options = [],
      preserveMenuWidth,
      shrinkLabel,
      value,
      ...rest
    } = props

    const handleChange = useCallback(
      (option: SingleValue<Option<unknown>>) => {
        if (option) {
          onChange((option as Option<T>).value)
        }
      },
      [onChange],
    )

    const flatOptionsList = options.reduce<Option<T>[]>((acc, entry) => {
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
              state: PlaceholderProps<Option<T>, false>,
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
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          ref={ref as React.Ref<any>}
          styles={
            styles as StylesConfig<
              Option<unknown>,
              false,
              GroupBase<Option<unknown>>
            >
          }
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
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          ref={ref as React.Ref<any>}
          styles={
            styles as StylesConfig<
              Option<unknown>,
              false,
              GroupBase<Option<unknown>>
            >
          }
          value={selectedOption}
        />
      </div>
    )
  },
) as <T>(
  props: SelectProps<T> & {
    ref?: React.ForwardedRef<
      SelectInstance<Option<T>, false, GroupBase<Option<T>>>
    >
  },
) => JSX.Element

export { Select }

export type { Option, SelectProps }

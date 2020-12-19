export const add = (key, value) => theme => ({ ...theme, [key]: value })

export const maxContainerWidth = 1000

export const breakpoints = {
  values: {
    xs: 0,
    sm: 768,
    md: 850,
    lg: maxContainerWidth,
    xl: 1264,
  },
}

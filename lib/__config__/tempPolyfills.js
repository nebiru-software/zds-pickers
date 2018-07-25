// Workaround for issue in React-16
// https://github.com/facebook/jest/issues/4545#issuecomment-332762365

global.requestAnimationFrame = (cb) => {
  setTimeout(cb, 0)
}

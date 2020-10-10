import React from 'react'
import { getDate, getMonth } from 'date-fns'
import SnowStorm from 'react-snowstorm'

const active = () => {
  const month = getMonth(new Date()) + 1
  const date = getDate(new Date())

  switch (month) {
    case 11:
      return date >= 24
    case 12:
      return true
    case 1:
      return date <= 4
    default:
      return false
  }
}

const Snow = () => (
  <div>
    {active() && (
    <SnowStorm
      color="#ddd"
      flakesMax={15}
      followMouse={false}
      snowStick={false}
      vMaxX={1}
      vMaxY={1}
    />
    )}
  </div>
)

export default Snow

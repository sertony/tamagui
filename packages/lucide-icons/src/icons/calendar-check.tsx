import type { IconProps } from '@tamagui/helpers-icon'
import { themed } from '@tamagui/helpers-icon'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Symbol,
  Use,
  Circle as _Circle,
  Text as _Text,
} from 'react-native-svg'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Rect width="18" height="18" x="3" y="4" rx="2" ry="2" stroke={color} />
      <Line x1="16" x2="16" y1="2" y2="6" stroke={color} />
      <Line x1="8" x2="8" y1="2" y2="6" stroke={color} />
      <Line x1="3" x2="21" y1="10" y2="10" stroke={color} />
      <Path d="m9 16 2 2 4-4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CalendarCheck'

export const CalendarCheck = memo<IconProps>(themed(Icon))

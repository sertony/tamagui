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
      <Path d="M10 13V7" stroke={color} />
      <Path d="M14 13V7" stroke={color} />
      <Rect width="20" height="14" x="2" y="3" rx="2" stroke={color} />
      <Path d="M12 17v4" stroke={color} />
      <Path d="M8 21h8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MonitorPause'

export const MonitorPause = memo<IconProps>(themed(Icon))

import * as React from 'react';
import type { SvgProps } from 'react-native-svg';

export default function SvgMock(props: SvgProps) {
  return React.createElement('Svg', { accessibilityRole: 'image', ...props });
}

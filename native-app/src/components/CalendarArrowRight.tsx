import Svg, { Path, SvgProps } from 'react-native-svg';

export interface CalendarArrowRightProps extends SvgProps {
  color?: string;
  size?: number;
}

export function CalendarArrowRight({
  color = '#a1a1aa',
  size = 22,
  ...props
}: CalendarArrowRightProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Path d="M8 2v3" />
      <Path d="M16 2v3" />
      <Path d="M3 9h18" />
      <Path d="M3 12V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
      <Path d="M2 17h11" />
      <Path d="m9 13 4 4-4 4" />
    </Svg>
  );
}

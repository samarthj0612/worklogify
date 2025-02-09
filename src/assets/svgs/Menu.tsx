import * as React from "react"
import Svg, { SvgProps, G, Path } from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg
    fill="none"
    viewBox="-0.5 0 25 25"
    {...props}
  >
    <G
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M6.5 10.32a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17.5 10.32a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM6.5 21.32a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17.5 21.32a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
    </G>
  </Svg>
)
export default SvgComponent

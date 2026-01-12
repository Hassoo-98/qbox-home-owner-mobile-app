import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = ({ color = "black", size = 24, strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.5 7.5V13.5C21.5 17.271 21.5 19.157 20.33 20.328C19.157 21.5 17.271 21.5 13.5 21.5H10M21.5 7.5L20.132 5.315C19.271 3.939 18.839 3.251 18.161 2.875C17.483 2.5 16.671 2.5 15.047 2.5H8.897C7.237 2.5 6.408 2.5 5.72 2.889C5.032 3.279 4.606 3.99 3.752 5.413L2.5 7.5M21.5 7.5H2.5M2.5 14V7.5M12 7.5V2.5M8 14.5C8 14.5 10.5 16.341 10.5 17C10.5 17.659 8 19.5 8 19.5M10 17H4.75C4.15326 17 3.58097 17.2371 3.15901 17.659C2.73705 18.081 2.5 18.6533 2.5 19.25C2.5 19.8467 2.73705 20.419 3.15901 20.841C3.58097 21.2629 4.15326 21.5 4.75 21.5H5.5M14 10.5H10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;

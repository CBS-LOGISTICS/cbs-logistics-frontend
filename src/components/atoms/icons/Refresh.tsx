import * as React from "react";
import type { SVGProps } from "react";
const SvgRefresh = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      stroke="#0D0D12"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 2.667a5.333 5.333 0 0 0-2.667 9.953M8 2.667 6.667 1.333M8 2.667 7 4.333m1 9a5.333 5.333 0 0 0 2.667-9.953M8 13.333l1.333 1.334M8 13.333l1-1.666"
    />
  </svg>
);
export default SvgRefresh;

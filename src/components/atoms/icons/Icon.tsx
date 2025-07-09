import * as React from "react";
import type { SVGProps } from "react";
const SvgIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="#EEE9FD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.52 20.733A7.52 7.52 0 0 1 3 13.213M13.48 3.14A7.52 7.52 0 0 1 21 10.66"
    />
    <path
      stroke="#EEE9FD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18.407 14.158h-1.84a2.43 2.43 0 0 0-2.43 2.432v1.839a2.43 2.43 0 0 0 2.43 2.431h1.84a2.43 2.43 0 0 0 2.432-2.431v-1.84a2.43 2.43 0 0 0-2.432-2.43M7.39 3.14H5.55a2.43 2.43 0 0 0-2.43 2.432v1.84a2.43 2.43 0 0 0 2.43 2.43h1.84a2.43 2.43 0 0 0 2.431-2.43v-1.84A2.43 2.43 0 0 0 7.39 3.141"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcon;

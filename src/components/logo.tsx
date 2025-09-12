import { cn } from "@/lib/utils";
import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    id="logo"
    viewBox="0 0 112 32"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={cn("font-code", props.className)}
  >
    <style>
      {`
        #winking-eye {
          transform-origin: center;
          animation: blink 3s infinite;
        }

        @keyframes blink {
          0%, 45%, 100% { transform: scaleY(1); }
          50%, 55% { transform: scaleY(0.1); }
        }

        @media (prefers-reduced-motion: reduce) {
          #winking-eye {
            animation: none;
          }
        }
      `}
    </style>
    <g transform="matrix(1,0,0,1,-18,-16)">
      <g id="Layer1">
        <g transform="matrix(1.28866,0,0,1.28866,-44.1753,-9.43299)">
          <text x="49.375" y="32.482" style={{ fontSize: '12px', fill: 'currentColor' }}>thecue</text>
        </g>
        <g transform="matrix(1.28866,0,0,1.28866,-44.1753,-9.43299)">
          <g id="winking-eye">
            <path d="M102.052,24.088C102.052,23.503 102.536,23.019 103.121,23.019C103.706,23.019 104.19,23.503 104.19,24.088C104.19,24.673 103.706,25.157 103.121,25.157C102.536,25.157 102.052,24.673 102.052,24.088Z" fill="#D1FF3D" />
          </g>
          <text x="106.124" y="32.482" style={{ fontSize: '12px', fill: 'currentColor' }}>m</text>
        </g>
      </g>
    </g>
  </svg>
);

export default Logo;

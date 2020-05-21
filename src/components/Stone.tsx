import React from 'react';
import Player from 'models/Player';

export interface StoneProps {
  // All in svg units
  center: {
    x: number;
    y: number;
  };
  radius: number;
  borderWidth: number;
  player: Player;
}

const Stone: React.ComponentType<StoneProps> = ({
  center,
  radius,
  borderWidth
}: StoneProps) => {
  return (
    <g aria-label="stone">
      <defs>
        <radialGradient id="1r_0.75_0.75__A0A0A0-_000" fx="0.75" fy="0.75">
          <stop offset="0%" stopColor="#a0a0a0"></stop>
          <stop offset="100%" stopColor="#000000" stopOpacity="0.9"></stop>
        </radialGradient>
      </defs>
      <circle
        cx={center.x}
        cy={center.y}
        r={radius}
        fill="#ffffff"
        stroke="#000"
        strokeWidth="0"
      ></circle>
      <circle
        style={{ fillOpacity: 1, opacity: 1, strokeOpacity: 0.3 }}
        cx={center.x}
        cy={center.y}
        r={radius}
        fill="url(#1r_0.75_0.75__A0A0A0-_000)"
        stroke="#000"
        fillOpacity="1"
        opacity="1"
        strokeOpacity="0.3"
        strokeWidth={borderWidth}
      ></circle>
    </g>
  );
};

export default Stone;

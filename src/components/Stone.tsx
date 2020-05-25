import React, { useContext } from 'react';
import { useTheme } from '@material-ui/core/styles';

import Player from 'models/Player';
import { ServiceContext, Services } from 'services/ServiceContainer';

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
  borderWidth,
  player
}: StoneProps) => {
  const { gameController } = useContext(ServiceContext) as Services;
  const theme = useTheme();

  const stoneColor = player.equals(gameController.playerOne)
    ? theme.stoneColors.one
    : theme.stoneColors.two;

  const gradientId = `stone-radial-gradient-${center.x}-${center.y}`;
  return (
    <g aria-label="stone">
      <defs>
        <radialGradient id={gradientId} fx="0.3" fy="0.3">
          <stop offset="0%" stopColor={stoneColor.sunspot}></stop>
          <stop
            offset="100%"
            stopColor={stoneColor.main}
            stopOpacity="0.9"
          ></stop>
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
        fill={`url(#${gradientId})`}
        stroke={stoneColor.main}
        fillOpacity="1"
        opacity="1"
        strokeOpacity="0.3"
        strokeWidth={borderWidth}
      ></circle>
    </g>
  );
};

export default Stone;

import React, { useContext } from 'react';
import Coordinate from 'models/Coordinate';
import { observer } from 'mobx-react';
import { ServiceContext } from 'services/ServiceContainer';
import Cell from './Cell';
import * as utils from 'utils';

export interface BoardProps {
  widthPx: number;
}

const Board: React.ComponentType<BoardProps> = ({ widthPx }: BoardProps) => {
  const { gameController } = useContext(ServiceContext);
  const boardSize = gameController!.boardSize;
  const coordinates: Coordinate[] = utils.getCoordinates(boardSize);

  // Maximum length of a cell side in svg user units
  // The thing to remember here is that the height of the board (excluding
  // borders) is: sideLength * cos(30 degrees) * ( 4 * boardSize - 2)
  // The height of the board (excluding the width of the border) is always
  // (arbitrarily) set to 100 SVG user units. The whole SVG is then scaled
  // using viewBox to get the desired pixel width.
  const heightSvgUnits = 100;
  const cellSideLength =
    heightSvgUnits / (Math.cos((1 / 6) * Math.PI) * (4 * boardSize - 2));

  const widthSvgUnits =
    cellSideLength * 0.5 + (2 * boardSize - 1) * 1.5 * cellSideLength;

  const heightPx = (heightSvgUnits / widthSvgUnits) * widthPx;

  const borderWidthSvgUnits = 0.5;

  return (
    <svg
      aria-label="Game Board"
      role="group"
      width={`${widthPx}px`}
      height={`${heightPx}px`}
      viewBox={`0 0 ${widthSvgUnits + borderWidthSvgUnits} ${heightSvgUnits +
        borderWidthSvgUnits}`}
    >
      {coordinates.map(coord => (
        <Cell
          location={coord}
          cellSideLength={cellSideLength}
          borderWidth={borderWidthSvgUnits}
          key={coord.hash()}
        />
      ))}
    </svg>
  );
};

export default observer(Board);

import React, { useContext } from 'react';
import Coordinate from 'models/Coordinate';
import { observer } from 'mobx-react';
import { ServiceContext } from 'services/ServiceContainer';
import Cell from './Cell';
import * as utils from 'utils';

const Board: React.ComponentType = () => {
  const { gameController } = useContext(ServiceContext);
  const boardSize = gameController!.boardSize;
  const coordinates: Coordinate[] = utils.getCoordinates(boardSize);

  // Maximum length of a cell side in svg user units
  // The thing to remember here is that the height of the board (excluding
  // borders) is: sideLength * cos(30 degrees) * ( 4 * boardSize - 2)
  // The height of the SVG in user units is always (arbitrarily) set to 100,
  // and then the board is scaled using viewBox.
  const heightSvgUnits = 100;
  const maxCellSideLength =
    heightSvgUnits / (Math.cos((1 / 6) * Math.PI) * (4 * boardSize - 2));

  const cellSideLength = maxCellSideLength;

  const widthSvgUnits =
    cellSideLength * 0.5 + (2 * boardSize - 1) * 1.5 * cellSideLength;
  const heightPx = 1000;
  const widthPx = (widthSvgUnits / heightSvgUnits) * heightPx;

  return (
    <svg
      aria-labelledby="game-board-title"
      role="group"
      width={`${widthPx}px`}
      height={`${heightPx}px`}
      viewBox={`0 0 ${widthSvgUnits} ${heightSvgUnits}`}
    >
      <title id="game-board-title">Game Board</title>
      {coordinates.map(coord => (
        <Cell
          location={coord}
          cellSideLength={maxCellSideLength}
          key={coord.hash()}
        />
      ))}
    </svg>
  );
};

export default observer(Board);

import React, { useContext, KeyboardEvent } from 'react';
import Coordinate, { File } from 'models/Coordinate';
import { observer } from 'mobx-react';
import { ServiceContext } from 'services/ServiceContainer';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import * as utils from 'utils';

type SvgCoordinate = { x: number; y: number };

function getCellHeight(cellSideLength: number): number {
  return 2 * cellSideLength * Math.cos((1 / 6) * Math.PI);
}

/**
 *
 * @param file The file of interest.
 * @param cellSideLength The length (in SVG user units) of a single side of
 * a cell.
 * @param cellHeight The height of a cell in SVG user units. Passed in here
 * to prevent repeated trig calculations.
 * @param boardSize The size of the board.
 * @return The coordinates in SVG user space of the top left corner of the first
 * cell in the given file.
 */
function fileStartingCoords({
  file,
  cellSideLength,
  cellHeight,
  boardSize
}: {
  file: File;
  cellSideLength: number;
  boardSize: number;
  cellHeight: number;
}): SvgCoordinate {
  const fileIndex = utils.getFileIndex({ boardSize, file });
  const halfLength = 0.5 * cellSideLength;
  const halfHeight = 0.5 * cellHeight;

  if (fileIndex >= boardSize - 1) {
    return {
      x: halfLength,
      y:
        (boardSize - 1) * halfHeight +
        (2 * boardSize - 2 - fileIndex) * cellHeight
    };
  } else {
    const distanceFromCorner = boardSize - 1 - fileIndex;
    return {
      x: distanceFromCorner * 1.5 * cellSideLength + halfLength,
      y: distanceFromCorner * halfHeight + halfHeight * (3 * boardSize - 3)
    };
  }
}

/**
 *
 * @param cellSideLength The length (in SVG user units) of a single side of
 * a cell.
 * @param cellHeight The height of a cell in SVG user units. Passed in here
 * to prevent repeated trig calculations.
 * @param boardSize The size of the board.
 * @param cellCoordinates The board coordinates of the cell
 * @return The SVG user coordinates of the top left corner of the cell with
 * the given board coordinates.
 */
function getSvgCoords({
  cellSideLength,
  cellHeight,
  boardSize,
  cellCoordinates
}: {
  cellSideLength: number;
  cellHeight: number;
  boardSize: number;
  cellCoordinates: Coordinate;
}): SvgCoordinate {
  const { x: startX, y: startY } = fileStartingCoords({
    file: cellCoordinates.file,
    cellSideLength,
    cellHeight,
    boardSize
  });

  const firstRankInFile = utils.getFirstRankInFile({
    boardSize,
    file: cellCoordinates.file
  });

  const inset = cellCoordinates.rank - firstRankInFile;
  return {
    x: startX + inset * 1.5 * cellSideLength,
    y: startY - inset * 0.5 * cellHeight
  };
}

const useCellStyles = makeStyles(theme =>
  createStyles({
    root: {
      fill: theme.palette.background.paper,
      stroke: theme.palette.common.black,
      '&:focus': {
        fill: theme.palette.grey['300'],
        outline: 0
      }
    }
  })
);

/**
 * All points are initially calculated without taking into account the width
 * of the border. This made the math easier. This function MUST be called on
 * each point before it is used in the SVG in order to adjust for border width.
 */
function adjustPoint({
  point,
  borderWidth
}: {
  point: SvgCoordinate;
  borderWidth: number;
}): SvgCoordinate {
  return {
    x: point.x + 0.5 * borderWidth,
    y: point.y + 0.5 * borderWidth
  };
}

export interface CellProps {
  location: Coordinate;
  /**
   * Length of each side of cell's hexagon.
   * Should be given in SVG user units.
   */
  cellSideLength: number;
  /**
   * Width of the cell border.
   * Should be given in SVG user units.
   */
  borderWidth: number;
  /**
   * The tab index to use on the underlying element
   */
  tabIndex: number;
  onKeyDown: (event: KeyboardEvent<SVGElement>) => void;
}

const Cell: React.ComponentType<CellProps> = ({
  location,
  cellSideLength,
  borderWidth,
  tabIndex,
  onKeyDown
}: CellProps) => {
  const styleClasses = useCellStyles();
  const { gameController } = useContext(ServiceContext);
  const cellHeight = getCellHeight(cellSideLength);
  const topLeft: SvgCoordinate = getSvgCoords({
    boardSize: gameController!.boardSize,
    cellCoordinates: location,
    cellSideLength,
    cellHeight
  });
  const topRight: SvgCoordinate = {
    x: topLeft.x + cellSideLength,
    y: topLeft.y
  };
  const middleRight: SvgCoordinate = {
    x: topLeft.x + 1.5 * cellSideLength,
    y: topLeft.y + 0.5 * cellHeight
  };
  const bottomRight: SvgCoordinate = {
    x: topRight.x,
    y: topLeft.y + cellHeight
  };
  const bottomLeft: SvgCoordinate = {
    x: topLeft.x,
    y: bottomRight.y
  };
  const middleLeft: SvgCoordinate = {
    x: topLeft.x - 0.5 * cellSideLength,
    y: middleRight.y
  };

  const formatPoint = (point: SvgCoordinate): string => {
    const adjustedPoint = adjustPoint({ point, borderWidth });
    return `${adjustedPoint.x},${adjustedPoint.y}`;
  };
  return (
    <polygon
      className={styleClasses.root}
      points={`${formatPoint(topLeft)} ${formatPoint(topRight)} ${formatPoint(
        middleRight
      )} ${formatPoint(bottomRight)} ${formatPoint(bottomLeft)} ${formatPoint(
        middleLeft
      )}`}
      role="button"
      aria-label={`Cell ${location.file}${location.rank}`}
      data-cord-hash={location.hash()}
      aria-pressed="false"
      strokeWidth={borderWidth}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    />
  );
};

export default observer(Cell);

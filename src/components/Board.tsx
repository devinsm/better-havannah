import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  KeyboardEvent
} from 'react';
import Coordinate from 'models/Coordinate';
import { observer } from 'mobx-react';
import { ServiceContext } from 'services/ServiceContainer';
import Cell from './Cell';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import * as utils from 'utils';

const useBoardStyles = makeStyles(() =>
  createStyles({
    root: {
      filter:
        'drop-shadow(0px 5px 5px rgba(0, 0, 0, 0.2)) drop-shadow(0px 8px 10px rgba(0,0,0,0.14)) drop-shadow(0px 3px 14px rgba(0,0,0,0.12))'
    }
  })
);

export interface BoardProps {
  widthPx: number;
}

const getTopLeftCornerCord = (boardSize: number): Coordinate => {
  const files = utils.getFiles(boardSize);
  const lastFile = files[files.length - 1];
  return new Coordinate({
    file: lastFile,
    rank: utils.getFirstRankInFile({ boardSize, file: lastFile })
  });
};

function getBoardDimensions({
  boardSize,
  widthPx
}: {
  boardSize: number;
  widthPx: number;
}): {
  px: {
    width: number;
    height: number;
  };
  svgUnits: {
    width: number;
    height: number;
    cellSideLength: number;
  };
} {
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

  return {
    px: {
      width: widthPx,
      height: heightPx
    },
    svgUnits: {
      width: widthSvgUnits,
      height: heightSvgUnits,
      cellSideLength
    }
  };
}

function handleCellKeyDown({
  key,
  boardRootElement,
  focusedCell,
  boardSize,
  setFocusableCell
}: {
  key: string;
  boardRootElement: HTMLElement | null;
  focusedCell: Coordinate;
  boardSize: number;
  setFocusableCell: (cord: Coordinate) => void;
}): void {
  if (!boardRootElement) {
    return;
  }

  let delta: {
    file: number;
    rank: number;
  } | null = null;
  switch (key) {
    case 's':
      delta = {
        file: -1,
        rank: -1
      };
      break;
    case 'd':
      delta = {
        file: -1,
        rank: 0
      };
      break;
    case 'e':
      delta = {
        file: 0,
        rank: 1
      };
      break;
    case 'w':
      delta = {
        file: 1,
        rank: 1
      };
      break;
    case 'q':
      delta = {
        file: 1,
        rank: 0
      };
      break;
    case 'a':
      delta = {
        file: 0,
        rank: -1
      };
      break;
  }

  if (delta === null) {
    return;
  }

  const allFiles = utils.getFiles(boardSize);
  const fileIndex = utils.getFileIndex({ boardSize, file: focusedCell.file });

  const newFileIndex = fileIndex + delta.file;
  const newRank = focusedCell.rank + delta.rank;
  if (
    newFileIndex >= 0 &&
    newFileIndex < allFiles.length &&
    newRank >=
      utils.getFirstRankInFile({ boardSize, file: allFiles[newFileIndex] }) &&
    newRank <=
      utils.getLastRankInFile({ boardSize, file: allFiles[newFileIndex] })
  ) {
    const cordToBeFocused = new Coordinate({
      file: allFiles[newFileIndex],
      rank: newRank
    });
    const toBeFocused = boardRootElement.querySelector(
      `[data-cord-hash='${cordToBeFocused.hash()}']`
    );
    if (toBeFocused) {
      (toBeFocused as HTMLButtonElement).focus();
      setFocusableCell(cordToBeFocused);
    }
  }
}

const Board: React.ComponentType<BoardProps> = ({ widthPx }: BoardProps) => {
  const styleClasses = useBoardStyles();
  const rootRef = useRef(null);
  const { gameController } = useContext(ServiceContext);
  const boardSize = gameController!.boardSize;
  const coordinates: Coordinate[] = utils.getCoordinates(boardSize);

  // used for roving tab index
  const [focusableCell, setFocusableCell] = useState(
    getTopLeftCornerCord(boardSize)
  );
  // Board size will not change during game play
  useEffect(() => setFocusableCell(getTopLeftCornerCord(boardSize)), [
    boardSize
  ]);

  const boardDims = useMemo(() => getBoardDimensions({ boardSize, widthPx }), [
    boardSize,
    widthPx
  ]);
  const borderWidthSvgUnits = 0.5;

  return (
    <svg
      className={styleClasses.root}
      aria-label="Game Board"
      role="group"
      width={`${boardDims.px.width}px`}
      height={`${boardDims.px.height}px`}
      viewBox={`0 0 ${boardDims.svgUnits.width +
        borderWidthSvgUnits} ${boardDims.svgUnits.height +
        borderWidthSvgUnits}`}
      ref={rootRef}
    >
      {coordinates.map(cord => (
        <Cell
          location={cord}
          cellSideLength={boardDims.svgUnits.cellSideLength}
          borderWidth={borderWidthSvgUnits}
          key={cord.hash()}
          tabIndex={cord.equals(focusableCell) ? 0 : -1}
          onKeyDown={(event: KeyboardEvent<SVGElement>): void =>
            handleCellKeyDown({
              key: event.key,
              boardRootElement: rootRef.current,
              focusedCell: cord,
              boardSize,
              setFocusableCell
            })
          }
        />
      ))}
    </svg>
  );
};

export default observer(Board);

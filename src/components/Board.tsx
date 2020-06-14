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
import { ServiceContext, Services } from 'services/ServiceContainer';
import Cell from './Cell';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import BoardModel from 'models/Board';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = () =>
  createStyles({
    root: {}
  });

export interface BoardProps extends WithStyles<typeof styles> {
  widthPx: number;
}

const getTopLeftCornerCord = (boardModel: BoardModel): Coordinate => {
  const files = boardModel.getFiles();
  const lastFileIndex = files.length - 1;
  return new Coordinate({
    file: files[lastFileIndex],
    rank: boardModel.getFirstRankInFile(lastFileIndex)
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
  boardModel,
  setFocusableCell
}: {
  key: string;
  boardRootElement: HTMLElement | null;
  focusedCell: Coordinate;
  boardModel: BoardModel;
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

  const allFiles = boardModel.getFiles();

  const newFileIndex = focusedCell.fileIndex + delta.file;
  const newRank = focusedCell.rank + delta.rank;

  const cordToBeFocused = new Coordinate({
    file: allFiles[newFileIndex],
    rank: newRank
  });
  if (boardModel.isValidForBoard(cordToBeFocused)) {
    const toBeFocused = boardRootElement.querySelector(
      `[data-cord-hash='${cordToBeFocused.hash()}']`
    );
    if (toBeFocused) {
      (toBeFocused as HTMLButtonElement).focus();
      setFocusableCell(cordToBeFocused);
    }
  }
}

const Board: React.ComponentType<BoardProps> = ({
  widthPx,
  classes
}: BoardProps) => {
  const rootRef = useRef(null);
  const { gameController } = useContext(ServiceContext) as Services;
  const boardModel = gameController.board;
  const coordinates: Coordinate[] = boardModel.getCoordinates();

  // used for roving tab index
  const [focusableCell, setFocusableCell] = useState(
    getTopLeftCornerCord(boardModel)
  );
  // Board size will not change during game play
  useEffect(() => setFocusableCell(getTopLeftCornerCord(boardModel)), [
    boardModel
  ]);

  const boardDims = useMemo(
    () => getBoardDimensions({ boardSize: boardModel.size, widthPx }),
    [boardModel, widthPx]
  );
  const borderWidthSvgUnits = 0.5;

  return (
    <svg
      className={classes.root}
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
              boardModel,
              setFocusableCell
            })
          }
        />
      ))}
    </svg>
  );
};

export default withStyles(styles)(observer(Board));

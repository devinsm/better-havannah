import Coordinate, { File } from 'models/Coordinate';

/**
 * @param boardSize The size of the board.
 * @return An array of all files for the given board size
 */
export function getFiles(boardSize: number): File[] {
  const allPossibleFiles: File[] = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ];
  return allPossibleFiles.slice(0, 2 * boardSize - 1);
}

// Should not be exported. Use getLastRankInFile instead.
function getMaxRank(boardSize: number): number {
  return 2 * boardSize - 1;
}

/**
 * @param boardSize The size of the board.
 * @returns The coordinates of all cells on a board of the given size.
 */
export function getCoordinates(boardSize: number): Coordinate[] {
  const allFiles: File[] = getFiles(boardSize);

  const coordinates: Coordinate[] = [];
  for (let rank = 1; rank <= getMaxRank(boardSize); rank++) {
    let filesForRank: File[] = [];
    if (rank <= boardSize) {
      filesForRank = allFiles.slice(0, boardSize + rank - 1);
    } else {
      filesForRank = allFiles.slice(rank - boardSize);
    }
    for (const file of filesForRank) {
      coordinates.push(new Coordinate({ file, rank }));
    }
  }

  return coordinates;
}

/**
 * @param boardSize The size of the board.
 * @param file A file on the board.
 * @return A zero based index for the file (file 'a' gets index 0, file 'b'
 * gets index 1, etc.)
 */
export function getFileIndex({
  boardSize,
  file
}: {
  boardSize: number;
  file: File;
}): number {
  const allFiles = getFiles(boardSize);
  const index = allFiles.findIndex(item => item === file);
  if (index < 0) {
    throw Error(`file ${file} not on board of size ${boardSize}`);
  }

  return index;
}

/**
 * @param boardSize The size of the board.
 * @param file A file on the board.
 * @returns The first rank in the given file on a board of the given size.
 */
export function getFirstRankInFile({
  boardSize,
  file
}: {
  boardSize: number;
  file: File;
}): number {
  const fileIndex = getFileIndex({ boardSize, file });
  if (fileIndex <= boardSize - 1) {
    return 1;
  } else {
    return 1 + (fileIndex - (boardSize - 1));
  }
}

/**
 * @param boardSize The size of the board.
 * @param file A file on the board.
 * @returns The last rank in the given file on a board of the given size.
 */
export function getLastRankInFile({
  boardSize,
  file
}: {
  boardSize: number;
  file: File;
}): number {
  const fileIndex = getFileIndex({ boardSize, file });
  if (fileIndex >= boardSize - 1) {
    return getMaxRank(boardSize);
  } else {
    return getMaxRank(boardSize) - (boardSize - 1 - fileIndex);
  }
}

export function getCellLabel(cord: Coordinate) {
  return `Cell ${cord.file}${cord.rank}`;
}

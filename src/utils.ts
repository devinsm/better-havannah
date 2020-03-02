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

/**
 * @param boardSize The size of the board.
 * @returns The coordinates of all cells on a board of the given size.
 */
export function getCoordinates(boardSize: number): Coordinate[] {
  const allFiles: File[] = getFiles(boardSize);

  const coordinates: Coordinate[] = [];
  for (let rank = 1; rank < 2 * boardSize; rank++) {
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

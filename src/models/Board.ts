import Coordinate, { File } from 'models/Coordinate';

export const MAX_BOARD_SIZE = 13;
export type BoardSide =
  | 'topLeft'
  | 'topRight'
  | 'middleRight'
  | 'middleLeft'
  | 'bottomRight'
  | 'bottomLeft';
export default class BoardModel {
  readonly size: number;
  constructor(size: number) {
    if (size > MAX_BOARD_SIZE) {
      throw new Error(`Max board size is ${MAX_BOARD_SIZE}`);
    }
    if (size < 2) {
      throw new Error(`Min board size is 2`);
    }
    this.size = size;
  }

  isValidForBoard = (cord: Coordinate): boolean => {
    return (
      cord.fileIndex >= 0 &&
      cord.fileIndex < this.getFiles().length &&
      cord.rank >= this.getFirstRankInFile(cord.fileIndex) &&
      cord.rank <= this.getLastRankInFile(cord.fileIndex)
    );
  };

  getNeighbors = (cord: Coordinate): Coordinate[] => {
    const neighbors: Coordinate[] = [];
    const allFiles = this.getFiles();
    const diffs = [
      { file: 1, rank: 1 },
      { file: 0, rank: 1 },
      { file: -1, rank: 0 },
      { file: -1, rank: -1 },
      { file: 0, rank: -1 },
      { file: 1, rank: 0 }
    ];
    for (const diff of diffs) {
      const newNeighbor = new Coordinate({
        file: allFiles[cord.fileIndex + diff.file],
        rank: cord.rank + diff.rank
      });
      if (this.isValidForBoard(newNeighbor)) {
        neighbors.push(newNeighbor);
      }
    }
    return neighbors;
  };

  isCorner = (cord: Coordinate): boolean => {
    return this.getNeighbors(cord).length === 3;
  };

  /** Does not include corners */
  isSide = (cord: Coordinate): boolean => {
    return this.getNeighbors(cord).length === 4;
  };

  getBoardSide = (cord: Coordinate): BoardSide | null => null;

  /**
   * @return An array of all files for the given board size
   */
  getFiles = (): File[] => {
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
    return allPossibleFiles.slice(0, 2 * this.size - 1);
  };

  private getMaxRank = (): number => {
    return 2 * this.size - 1;
  };

  /**
   * @returns The coordinates of all cells on a board of the given size.
   */
  getCoordinates = (): Coordinate[] => {
    const allFiles: File[] = this.getFiles();

    const coordinates: Coordinate[] = [];
    for (let rank = 1; rank <= this.getMaxRank(); rank++) {
      let filesForRank: File[] = [];
      if (rank <= this.size) {
        filesForRank = allFiles.slice(0, this.size + rank - 1);
      } else {
        filesForRank = allFiles.slice(rank - this.size);
      }
      for (const file of filesForRank) {
        coordinates.push(new Coordinate({ file, rank }));
      }
    }

    return coordinates;
  };

  /**
   * @returns The number of cells on the board. This is calculated using
   * a closed form formula in O(1) time, making it more efficient
   * than this.getCoordinates().length
   */
  getNumberOfCells = (): number => 3 * this.size * (this.size - 1) + 1;

  /**
   * @returns The first rank in the given file on a board of the given size.
   */
  getFirstRankInFile(fileIndex: number): number {
    if (fileIndex <= this.size - 1) {
      return 1;
    } else {
      return 1 + (fileIndex - (this.size - 1));
    }
  }

  /**
   * @returns The last rank in the given file on a board of the given size.
   */
  getLastRankInFile(fileIndex: number): number {
    if (fileIndex >= this.size - 1) {
      return this.getMaxRank();
    } else {
      return this.getMaxRank() - (this.size - 1 - fileIndex);
    }
  }
}

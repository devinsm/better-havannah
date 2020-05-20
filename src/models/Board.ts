import Coordinate, { File } from 'models/Coordinate';

export const MAX_BOARD_SIZE = 13;

export default class BoardModel {
  readonly size: number;
  constructor(size: number) {
    if (size > MAX_BOARD_SIZE) {
      throw new Error(`Max board size is ${MAX_BOARD_SIZE}`);
    }
    this.size = size;
  }

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
   * @param file A file on the board.
   * @return A zero based index for the file (file 'a' gets index 0, file 'b'
   * gets index 1, etc.)
   */
  getFileIndex(file: File): number {
    const allFiles = this.getFiles();
    const index = allFiles.findIndex(item => item === file);
    if (index < 0) {
      throw Error(`file ${file} not on board of size ${this.size}`);
    }

    return index;
  }

  /**
   * @param file A file on the board.
   * @returns The first rank in the given file on a board of the given size.
   */
  getFirstRankInFile(file: File): number {
    const fileIndex = this.getFileIndex(file);
    if (fileIndex <= this.size - 1) {
      return 1;
    } else {
      return 1 + (fileIndex - (this.size - 1));
    }
  }

  /**
   * @param file A file on the board.
   * @returns The last rank in the given file on a board of the given size.
   */
  getLastRankInFile(file: File): number {
    const fileIndex = this.getFileIndex(file);
    if (fileIndex >= this.size - 1) {
      return this.getMaxRank();
    } else {
      return this.getMaxRank() - (this.size - 1 - fileIndex);
    }
  }
}

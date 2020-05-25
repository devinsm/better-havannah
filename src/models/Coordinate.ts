/**
 * With size S board, only first (2 * S) - 1 letters valid.
 * This limits the board size to S <= 12, which I deemed acceptable.
 */
export type File =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

export default class Coordinate {
  // Coordinates are immutable
  readonly file: File;
  readonly rank: number;
  // zero based index with 0 for 'a', 1 for 'b', etc.
  // if constructed with a bad file, this will be -1
  readonly fileIndex: number;

  constructor({ file, rank }: { file: File; rank: number }) {
    this.file = file;
    this.rank = rank;
    this.fileIndex = 'abcdefghijklmnopqrstuvwxyz'.indexOf(file);
  }

  equals(other: Coordinate): boolean {
    return this.file === other.file && this.rank === other.rank;
  }

  hash(): string {
    return `${this.file}${this.rank}`;
  }
}

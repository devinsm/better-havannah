export default class Coordinate {
  // Cordinates are immutable
  readonly row: number;
  readonly col: number;

  constructor({ row, col }: { row: number; col: number }) {
    this.row = row;
    this.col = col;
  }

  equals(other: Coordinate): boolean {
    return this.row === other.row && this.col === other.col;
  }

  hash(): string {
    return `${this.row},${this.col}`;
  }
}

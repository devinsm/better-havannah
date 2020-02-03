import shortid from 'shortid';

export default class Player {
  stoneColor: string; // CSS color string
  readonly id: string;

  constructor({ stoneColor }: { stoneColor: string }) {
    this.stoneColor = stoneColor;
    this.id = shortid.generate();
  }

  equals(other: Player): boolean {
    return this === other;
  }
}

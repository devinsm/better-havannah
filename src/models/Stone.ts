import Cordinate from 'models/Coordinate';
import Player from 'models/Player';

export default class Stone {
  // Stones can not be moved
  readonly location: Cordinate;
  readonly owner: Player;

  constructor({ location, owner }: { location: Cordinate; owner: Player }) {
    this.location = location;
    this.owner = owner;
  }

  equals(other: Stone): boolean {
    return this.owner === other.owner && this.location === other.location;
  }

  hash(): string {
    return `${this.owner.id}:${this.location.hash()}`;
  }
}

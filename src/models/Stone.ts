import Coordinate from 'models/Coordinate';
import Player from 'models/Player';

export default class Stone {
  // Stones can not be moved
  readonly location: Coordinate;
  readonly owner: Player;

  constructor({ location, owner }: { location: Coordinate; owner: Player }) {
    this.location = location;
    this.owner = owner;
  }

  equals(other: Stone): boolean {
    return (
      this.owner.equals(other.owner) && this.location.equals(other.location)
    );
  }

  hash(): string {
    return `${this.owner.id}:${this.location.hash()}`;
  }
}

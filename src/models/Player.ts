export default class Player {
  readonly id: 'one' | 'two';

  constructor(id: 'one' | 'two') {
    this.id = id;
  }

  equals(other: Player): boolean {
    return this.id === other.id;
  }
}

export default class Player {
  readonly id: 'human' | 'bot';

  constructor(id: 'human' | 'bot') {
    this.id = id;
  }

  equals(other: Player): boolean {
    return this.id === other.id;
  }
}

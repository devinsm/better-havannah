import startCase from 'lodash/startCase';
export default class Player {
  readonly id: 'one' | 'two';

  constructor(id: 'one' | 'two') {
    this.id = id;
  }

  displayName = (): string => `Player ${startCase(this.id)}`;

  equals(other: Player): boolean {
    return this.id === other.id;
  }
}

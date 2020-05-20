import { observable, action, computed } from 'mobx';
import { createTransformer } from 'mobx-utils';
import BoardModel from 'models/Board';
import Player from 'models/Player';
import Stone from 'models/Stone';
import Coordinate from 'models/Coordinate';

export enum GameState {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED
}

export default class GameController {
  @observable
  private _board: BoardModel;

  // Prevents client code from directly setting board
  @computed({ keepAlive: true })
  get board(): BoardModel {
    return this._board;
  }

  @observable
  state: GameState;

  readonly us: Player = new Player('one');
  readonly them: Player = new Player('two');

  @observable
  currentPlayer: Player = this.us;

  @observable
  private readonly _stones: Map<string, Stone> = new Map();

  constructor() {
    this._board = new BoardModel(6);
    this.state = GameState.NOT_STARTED;
  }

  @action
  setBoardSize = (newSize: number): void => {
    if (this.state !== GameState.NOT_STARTED) {
      throw new Error('Board size can not be changed once game has started');
    }
    this._board = new BoardModel(newSize);
  };

  private _getStone = (cord: Coordinate): Stone | undefined =>
    this._stones.get(cord.hash());

  // Needed to update ui reactively
  // can only be called within a Mobx reactive context
  getStone = createTransformer((cord: Coordinate): Stone | undefined => {
    return this._getStone(cord);
  });

  private _canPlaceStone = (cord: Coordinate): boolean =>
    !!(
      this.state === GameState.IN_PROGRESS &&
      this.currentPlayer.equals(this.us) &&
      this._getStone(cord)
    );

  // Needed to update ui reactively
  // can only be called within a Mobx reactive context
  canPlaceStone = createTransformer((cord: Coordinate): boolean => {
    return this._canPlaceStone(cord);
  });

  @action
  placeStone = (cord: Coordinate): void => {
    if (!this._canPlaceStone(cord)) {
      throw new Error(`Can not place stone at ${cord.file}${cord.rank}`);
    }
    // TODO: hit backend
    this._stones.set(
      cord.hash(),
      new Stone({ location: cord, owner: this.us })
    );
  };
}

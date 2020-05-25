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

// Putting state in private variables on accessible via computed getters
// prevents client code from accidentally messing up internal state.
export default class GameController {
  @observable
  private _board: BoardModel;

  @computed({ keepAlive: true })
  get board(): BoardModel {
    return this._board;
  }

  @observable
  private _state: GameState;

  @computed({ keepAlive: true })
  get state(): GameState {
    return this._state;
  }

  @action
  startGame = (): void => {
    if (this._state !== GameState.NOT_STARTED) {
      throw Error('Game has already started');
    }
    this._state = GameState.IN_PROGRESS;
  };

  readonly playerOne: Player = new Player('one');
  readonly playerTwo: Player = new Player('two');

  @observable
  private _currentPlayer: Player = this.playerOne;

  @computed({ keepAlive: true })
  get currentPlayer(): Player {
    return this._currentPlayer;
  }

  @observable
  private _winner: Player | null = null;

  @computed({ keepAlive: true })
  get winner(): Player | null {
    return this._winner;
  }

  @observable
  private readonly _stones: Map<string, Stone> = new Map();

  constructor() {
    this._board = new BoardModel(6);
    this._state = GameState.NOT_STARTED;
  }

  @action
  setBoardSize = (newSize: number): void => {
    if (this._state !== GameState.NOT_STARTED) {
      throw new Error('Board size can not be changed once game has started');
    }
    this._board = new BoardModel(newSize);
  };

  private _getStone = (cord: Coordinate): Stone | undefined =>
    this._stones.get(cord.hash());

  /** should only be called within a Mobx reactive context */
  getStone = createTransformer((cord: Coordinate): Stone | undefined => {
    return this._getStone(cord);
  });

  private _canPlaceStone = (cord: Coordinate): boolean =>
    !!(this._state === GameState.IN_PROGRESS && !this._getStone(cord));

  /** should only be called within a Mobx reactive context */
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
      new Stone({ location: cord, owner: this.currentPlayer })
    );
    this._currentPlayer = this._currentPlayer.equals(this.playerOne)
      ? this.playerTwo
      : this.playerOne;
  };
}

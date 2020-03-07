import { observable, computed, action } from 'mobx';
import Stone from 'models/Stone';
import Player from 'models/Player';
import Coordinate from 'models/Coordinate';

const DEFAULT_BOARD_SIZE = 12;

export enum GameState {
  NOT_STARTED,
  IN_PROGRESS,
  WON,
  DRAW,
  /** Other player left, internet died, etc. */
  TERMINATED
}

export default class GameController {
  @observable
  private _boardSize: number = DEFAULT_BOARD_SIZE;

  /**
   * map from coordinate hash => stone at that coordinate
   */
  @observable
  private _stones: Map<string, Stone> = new Map();

  @observable
  private _gameState: GameState = GameState.NOT_STARTED;

  /** null if this.gameState === GameState.NOT_STARTED */
  @observable
  private _currentPlayer: Player | null = null;

  /**
   * Tiles on the path which won the game.
   * null unless this.gameState === GameState.WON
   */
  @observable
  private _winingTiles: Map<string, Coordinate> | null = null;

  @computed
  get boardSize(): number {
    return this._boardSize;
  }

  set boardSize(newSize: number) {
    // TODO
  }

  @computed
  get stones(): Map<string, Stone> {
    return this._stones;
  }

  @computed
  get gameState(): GameState {
    return this._gameState;
  }

  @computed
  get currentPlayer(): Player | null {
    return this._currentPlayer;
  }

  @computed
  get winningTiles(): Map<string, Coordinate> | null {
    return this._winingTiles;
  }

  @action
  placeStone(stone: Stone): void {
    // TODO
  }

  @action
  startGame(): void {
    // TODO
  }
}

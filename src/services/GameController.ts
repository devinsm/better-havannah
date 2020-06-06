import { observable, action, computed } from 'mobx';
import { createTransformer } from 'mobx-utils';
import BoardModel, { BoardSide } from 'models/Board';
import Player from 'models/Player';
import Stone from 'models/Stone';
import Coordinate from 'models/Coordinate';

export enum GameState {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED
}

class StoneGroup {
  board: BoardModel;
  /**use stone.location.hash() as key*/
  @observable
  stones: Map<string, Stone> = new Map();
  numberCornerStones = 0;
  sidesTouched: Set<BoardSide> = new Set();

  constructor(boardSize: number) {
    this.board = new BoardModel(boardSize);
  }

  get player(): Player | null {
    if (this.stones.size === 0) {
      return null;
    }
    return this.stones.values().next().value.owner;
  }

  // Client code responsible for checking if this stone is part of this group
  addStone = (stone: Stone): void => {
    if (this.board.isCorner(stone.location)) {
      this.numberCornerStones++;
    }

    const boardSide = this.board.getBoardSide(stone.location);
    if (boardSide !== null) {
      this.sidesTouched.add(boardSide);
    }

    this.stones.set(stone.location.hash(), stone);
  };
}

// Putting state in private variables only accessible via computed getters
// prevents client code from accidentally messing up internal state.
export default class GameController {
  readonly playerOne: Player = new Player('one');
  readonly playerTwo: Player = new Player('two');

  @observable
  private _board: BoardModel;

  @observable
  private _state: GameState;

  @observable
  private _currentPlayer: Player = this.playerOne;

  @observable
  private _winner: Player | null = null;

  @observable
  private _stone_groups: Set<StoneGroup> = new Set();

  constructor() {
    this._board = new BoardModel(6);
    this._state = GameState.NOT_STARTED;
  }

  @computed({ keepAlive: true })
  get board(): BoardModel {
    return this._board;
  }

  @computed({ keepAlive: true })
  get state(): GameState {
    return this._state;
  }

  @computed({ keepAlive: true })
  get currentPlayer(): Player {
    return this._currentPlayer;
  }

  @computed({ keepAlive: true })
  get winner(): Player | null {
    return this._winner;
  }

  @action
  startGame = (): void => {
    if (this._state !== GameState.NOT_STARTED) {
      throw Error('Game has already started');
    }
    this._state = GameState.IN_PROGRESS;
  };

  @action
  setBoardSize = (newSize: number): void => {
    if (this._state !== GameState.NOT_STARTED) {
      throw new Error('Board size can not be changed once game has started');
    }
    this._board = new BoardModel(newSize);
  };

  private _getStone = (cord: Coordinate): Stone | undefined => {
    for (const group of this._stone_groups.values()) {
      const stone = group.stones.get(cord.hash());
      if (stone) {
        return stone;
      }
    }
    return undefined;
  };

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
    const newStone = new Stone({ location: cord, owner: this._currentPlayer });

    const adjacentGroups: StoneGroup[] = [];
    const neighbors = this._board.getNeighbors(cord);
    for (const group of this._stone_groups.values()) {
      if (!group.player || group.player.equals(newStone.owner)) {
        for (const neighbor of neighbors) {
          if (group.stones.has(neighbor.hash())) {
            adjacentGroups.push(group);
            this._stone_groups.delete(group);
            break;
          }
        }
      }
    }

    let newGroup: StoneGroup = new StoneGroup(this._board.size);
    if (adjacentGroups.length === 1) {
      newGroup = adjacentGroups[0];
    } else {
      for (const group of adjacentGroups) {
        for (const stone of group.stones.values()) {
          newGroup.addStone(stone);
        }
      }
    }
    newGroup.addStone(newStone);

    this._stone_groups.add(newGroup);

    this._currentPlayer = this._currentPlayer.equals(this.playerOne)
      ? this.playerTwo
      : this.playerOne;

    if (this.isWinningGroup(newGroup)) {
      this._state = GameState.COMPLETED;
      this._winner = newGroup.player;
    }

    // draw if board full
    if (this.boardFull()) {
      this._state = GameState.COMPLETED;
    }
  };

  private boardFull(): boolean {
    let numStones = 0;
    for (const group of this._stone_groups.values()) {
      numStones += group.stones.size;
    }
    const boardSize = this._board.size;
    const numTilesOnBoard = 3 * boardSize * (boardSize - 1) + 1;
    return numTilesOnBoard === numStones;
  }

  private isWinningGroup = (stoneGroup: StoneGroup): boolean => {
    return (
      stoneGroup.numberCornerStones >= 2 || stoneGroup.sidesTouched.size >= 3
    );
  };
}

import { observable, action, computed } from 'mobx';
import { createTransformer } from 'mobx-utils';
import confetti, { Options } from 'canvas-confetti';

import BoardModel, { BoardSide } from 'models/Board';
import Player from 'models/Player';
import Stone from 'models/Stone';
import Coordinate from 'models/Coordinate';

export enum GameState {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED
}

/** Helper class to keep track of groups of connected stones */
class StoneGroup {
  private board: BoardModel;
  /**use stone.location.hash() as key*/
  @observable
  stones: Map<string, Stone> = new Map();
  private numberCornerStones = 0;
  private sidesTouched: Set<BoardSide> = new Set();

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

  hasBridge = (): boolean => {
    return this.numberCornerStones >= 2;
  };

  hasFork = (): boolean => {
    return this.sidesTouched.size >= 3;
  };

  private getNeighborsInGroup = (cord: Coordinate): Coordinate[] => {
    const allNeighbors = this.board.getNeighbors(cord);
    return allNeighbors.filter(neighbor => this.stones.has(neighbor.hash()));
  };

  /**
   * This detects a ring which passes through origin (which is the coordinate
   * the search starts from). A ring must encircle a tile, so simply detecting
   * cycles in our stone graph is not enough. The solution to this problem is
   * to prevent the previous and the next tile in the search from being adjacent
   * (i.e. avoid sharp turns). Intuitively this works since if the search turns
   * as hard as it can to the left (or as hard as it can to the right), if it
   * gets back to origin it is guaranteed to encircle a tile. When avoiding
   * a sharp turn, we could have gone directly from the previous to the next
   * stone. Thus the only things we can miss by avoiding sharp turns are
   * trivial three stone cycles which we don't care about.
   * @param prevLocation The previously visited location. Needed to avoid sharp
   * turns.
   * @param currentLocation The location we are currently searching from.
   * @param origin The stone the search began with (if we make it back here then
   * there is a ring)
   * @param visited A set of the hashes of the locations we've been to already.
   * origin should NOT be added to this set.
   */
  private detectRing = ({
    prevLocation,
    currentLocation,
    origin,
    visited
  }: {
    prevLocation: Coordinate;
    currentLocation: Coordinate;
    origin: Coordinate;
    visited: Set<string>;
  }): boolean => {
    if (currentLocation.equals(origin)) {
      return true;
    }
    visited.add(currentLocation.hash());

    const neighborsOfPrev = this.getNeighborsInGroup(prevLocation);
    const neighborsOfCurrent = this.getNeighborsInGroup(currentLocation);
    for (const neighbor of neighborsOfCurrent) {
      if (neighborsOfPrev.find(location => location.equals(neighbor))) {
        // avoid sharp turns
        continue;
      }
      if (neighbor.equals(prevLocation)) {
        // can't go backwards
        // this special case is needed because we don't put origin in visited
        continue;
      }
      if (visited.has(neighbor.hash())) {
        continue;
      }
      if (
        this.detectRing({
          prevLocation: currentLocation,
          currentLocation: neighbor,
          origin,
          visited
        })
      ) {
        return true;
      }
    }
    return false;
  };

  /**
   * In the controller we know which stone was most recently placed.
   * Since we check for rings after each play, and end the game if there is
   * a ring, any new ring will pass through the most recently placed stone.
   * Therefore this method only checks for rings through a specific stone,
   * so that the controller code can make use of it's special knowledge.
   */
  hasRingThrough = (stone: Stone): boolean => {
    if (
      !this.stones.has(stone.location.hash()) ||
      (this.player && !stone.owner.equals(this.player))
    ) {
      throw Error(`group does not contain stone`);
    }
    for (const neighbor of this.getNeighborsInGroup(stone.location)) {
      if (
        this.detectRing({
          prevLocation: stone.location,
          currentLocation: neighbor,
          origin: stone.location,
          visited: new Set()
        })
      ) {
        return true;
      }
    }
    return false;
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

    if (
      newGroup.hasBridge() ||
      newGroup.hasFork() ||
      newGroup.hasRingThrough(newStone)
    ) {
      this._state = GameState.COMPLETED;
      this._winner = newGroup.player;
      this.fireConfetti();
    }

    // draw if board full
    if (this.boardFull()) {
      this._state = GameState.COMPLETED;
      this.fireConfetti();
    }
  };

  private fireConfetti = (): void => {
    const count = 1000;
    const defaults: Options & { disableForReducedMotion: boolean } = {
      origin: { y: 0.7 },
      disableForReducedMotion: true
    };

    function fire(particleRatio: number, opts: Options): void {
      confetti(
        Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        })
      );
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55
    });
    fire(0.2, {
      spread: 60
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45
    });
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
}

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

class ConnectedComponent {
  board: BoardModel;
  stones: Map<string, Stone> = new Map();
  highestStone: Stone | null = null;
  numberCornerStones = 0;
  sidesTouched: Set<BoardSide> = new Set();

  constructor(boardSize: number) {
    this.board = new BoardModel(boardSize);
  }

  /**
   * @returns The coordinate which is vertically higher than the other on
   * the board
   */
  private higherStone = (stoneA: Stone, stoneB: Stone): Stone => {
    const cordA = stoneA.location;
    const cordB = stoneB.location;
    const fileDiff = cordA.fileIndex - cordB.fileIndex;
    const rankDiff = cordA.rank - cordB.rank;
    return fileDiff + rankDiff > 0 ? stoneA : stoneB;
  };

  // Client code responsible for checking if this stone is part of this
  // connected component
  addStone = (stone: Stone): void => {
    if (this.highestStone === null) {
      this.highestStone = stone;
    } else {
      this.highestStone = this.higherStone(stone, this.highestStone);
    }

    if (this.board.isCorner(stone.location)) {
      this.numberCornerStones++;
    }

    const boardSide = this.board.getBoardSide(stone.location);
    if (boardSide) {
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
  private readonly _stones: Map<string, Stone> = new Map();

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
    this._stones.set(
      cord.hash(),
      new Stone({ location: cord, owner: this.currentPlayer })
    );
    this._currentPlayer = this._currentPlayer.equals(this.playerOne)
      ? this.playerTwo
      : this.playerOne;

    const winner = this.determineWinner();

    if (this.boardFull() && !winner) {
      // draw
      this._state = GameState.COMPLETED;
    } else if (winner) {
      this._state = GameState.COMPLETED;
      this._winner = winner;
    }
  };

  private boardFull(): boolean {
    const numStones = this._stones.size;
    const boardSize = this._board.size;
    const numTilesOnBoard = 3 * boardSize * (boardSize - 1) + 1;
    return numTilesOnBoard === numStones;
  }

  /**
   * Uses DFS to find all stones which are in the same connected component as
   * from.
   *
   * @param from The stone to start the search from.
   * @param component The connected component to add to (should contain from)
   * @param unvisitedStones The stones which have not been added to any connected
   * component. Should not contain from. Should only contain stones with same
   * owner as from.
   */
  private depthFirstSearch({
    from,
    component,
    unvisitedStones
  }: {
    from: Stone;
    component: ConnectedComponent;
    unvisitedStones: Map<string, Stone>;
  }): void {
    for (const neighbor of this._board.getNeighbors(from.location)) {
      const stoneAtNeighbor = unvisitedStones.get(neighbor.hash());
      if (stoneAtNeighbor) {
        unvisitedStones.delete(neighbor.hash());
        component.addStone(stoneAtNeighbor);
        this.depthFirstSearch({
          from: stoneAtNeighbor,
          component,
          unvisitedStones
        });
      }
    }
  }

  private getConnectedComponents = (player: Player): ConnectedComponent[] => {
    const unvisitedStones: Map<string, Stone> = new Map(
      [...this._stones.entries()].filter(([hash, stone]) =>
        stone.owner.equals(player)
      )
    );
    const components: ConnectedComponent[] = [];

    while (unvisitedStones.size > 0) {
      const nextStone = unvisitedStones.values().next().value;
      unvisitedStones.delete(nextStone.location.hash());

      const nextComponent = new ConnectedComponent(this._board.size);
      nextComponent.addStone(nextStone);

      this.depthFirstSearch({
        from: nextStone,
        component: nextComponent,
        unvisitedStones
      });
      components.push(nextComponent);
    }
    return components;
  };

  private componentIsWinner = (component: ConnectedComponent): boolean => {
    if (component.numberCornerStones >= 2 || component.sidesTouched.size > 3) {
      return true;
    }
    //TODO check for ring
    return false;
  };

  private determineWinner = (): Player | null => {
    const componentPlayerOne = this.getConnectedComponents(this.playerOne);
    if (
      componentPlayerOne.find(component => this.componentIsWinner(component))
    ) {
      return this.playerOne;
    }

    const componentsPlayerTwo = this.getConnectedComponents(this.playerTwo);
    if (
      componentsPlayerTwo.find(component => this.componentIsWinner(component))
    ) {
      return this.playerTwo;
    }

    return null;
  };
}

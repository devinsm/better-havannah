import { observable, action } from 'mobx';
import BoardModel from 'models/Board';

export enum GameState {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED
}

export default class GameController {
  @observable
  board: BoardModel;

  @observable
  state: GameState;

  constructor() {
    this.board = new BoardModel(6);
    this.state = GameState.NOT_STARTED;
  }

  @action
  setBoardSize = (newSize: number): void => {
    if (this.state !== GameState.NOT_STARTED) {
      throw new Error('Board size can not be changed once game has started');
    }
    this.board = new BoardModel(newSize);
  };
}

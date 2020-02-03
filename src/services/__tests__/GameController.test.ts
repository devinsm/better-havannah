import GameController, { GameState } from 'services/GameController';

test('the controller is initialized properly', () => {
  const controller = new GameController();
  expect(controller.gameState).toBe(GameState.NOT_STARTED);
  expect(controller.stones.size).toBe(0);
  expect(controller.currentPlayer).toBe(null);
  expect(controller.winningTiles).toBe(null);
});

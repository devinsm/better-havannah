import { autorun } from 'mobx';
import differenceBy from 'lodash/differenceBy';

import GameController, { GameState } from '../GameController';
import Coordinate from 'models/Coordinate';
import Stone from 'models/Stone';

test('you can start the game', () => {
  const controller = new GameController();
  expect(controller.state).toBe(GameState.NOT_STARTED);

  controller.startGame();

  expect(controller.state).toBe(GameState.IN_PROGRESS);
});

test('you can change board size before game starts', () => {
  const controller = new GameController();
  controller.setBoardSize(9);
  expect(controller.board.size).toBe(9);
  controller.setBoardSize(3);
  expect(controller.board.size).toBe(3);
});

test('you can not change board size after the game starts', () => {
  const controller = new GameController();
  controller.startGame();
  expect(() => controller.setBoardSize(5)).toThrow();
});

function expectStones({
  controller,
  stones
}: {
  controller: GameController;
  stones: Stone[];
}): Promise<void> {
  return new Promise((resolve, reject) => {
    // getStone can only be called within a reactive context
    // so we need to wrap it in an autorun
    autorun(
      reaction => {
        for (const cord of controller.board.getCoordinates()) {
          const expectedStone = stones.find(stone =>
            stone.location.equals(cord)
          );
          const receivedStone = controller.getStone(cord);
          if (expectedStone === undefined) {
            expect(receivedStone).toBeUndefined();
          } else {
            expect(receivedStone).toBeDefined();
            expect(expectedStone.equals(receivedStone as Stone)).toBeTruthy();
          }
        }
        reaction.dispose();
        resolve();
      },
      {
        onError: error => reject(error)
      }
    );
  });
}

// eslint-disable-next-line jest/expect-expect
test('initially all tiles do not have stones', () => {
  const controller = new GameController();
  controller.setBoardSize(5); // use a small board for faster tests
  controller.startGame();

  return expectStones({ controller, stones: [] });
});

// eslint-disable-next-line jest/expect-expect
test('can place a stone as both players', () => {
  const controller = new GameController();
  controller.setBoardSize(5);
  controller.startGame();

  const stones = [
    new Stone({
      location: new Coordinate({ file: 'e', rank: 4 }),
      owner: controller.playerOne
    }),
    new Stone({
      location: new Coordinate({ file: 'h', rank: 7 }),
      owner: controller.playerTwo
    }),
    new Stone({
      location: new Coordinate({ file: 'f', rank: 8 }),
      owner: controller.playerOne
    })
  ];
  for (const stone of stones) {
    controller.placeStone(stone.location);
  }

  return expectStones({ controller, stones });
});

test('can not place stone when tile taken', () => {
  const controller = new GameController();
  controller.setBoardSize(5);
  controller.startGame();

  const stones = [
    new Stone({
      location: new Coordinate({ file: 'e', rank: 4 }),
      owner: controller.playerOne
    }),
    new Stone({
      location: new Coordinate({ file: 'h', rank: 7 }),
      owner: controller.playerTwo
    }),
    new Stone({
      location: new Coordinate({ file: 'f', rank: 8 }),
      owner: controller.playerOne
    })
  ];
  for (const stone of stones) {
    controller.placeStone(stone.location);
  }

  const cordsWithStones = stones.map(stone => stone.location);
  const cordsWithoutStones = differenceBy(
    controller.board.getCoordinates(),
    cordsWithStones,
    cord => cord.hash()
  );

  return new Promise((resolve, reject) => {
    // canPlaceStone can only be called in a reactive context
    autorun(
      reaction => {
        for (const cord of cordsWithStones) {
          expect(controller.canPlaceStone(cord)).toBe(false);
        }
        for (const cord of cordsWithoutStones) {
          expect(controller.canPlaceStone(cord)).toBe(true);
        }
        reaction.dispose();
        resolve();
      },
      {
        onError: error => reject(error)
      }
    );
  });
});

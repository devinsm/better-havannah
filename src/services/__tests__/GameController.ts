import { autorun } from 'mobx';
import differenceBy from 'lodash/differenceBy';

import GameController, { GameState } from '../GameController';
import Coordinate from 'models/Coordinate';
import Stone from 'models/Stone';
import Player from 'models/Player';

test('you can start the game', () => {
  const controller = new GameController();
  expect(controller.state).toBe(GameState.NOT_STARTED);

  controller.startGame();

  expect(controller.state).toBe(GameState.IN_PROGRESS);
});

test('you can change board size before the game starts', () => {
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
test('you can place a stone as both players', () => {
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

test('canPlaceStone checks if tile taken', () => {
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

test('can not place stone on taken tile', () => {
  const controller = new GameController();
  controller.setBoardSize(5);
  controller.startGame();

  const cord = new Coordinate({ file: 'a', rank: 1 });
  controller.placeStone(cord);
  expect(() => controller.placeStone(cord)).toThrow();
});

interface TestPlay {
  cord: Coordinate;
  expectedCurrentPlayer: Player;
}

function expectGame({
  controller,
  plays,
  expectedWinner
}: {
  controller: GameController;
  plays: TestPlay[];
  expectedWinner: Player | null;
}): void {
  for (const { cord, expectedCurrentPlayer } of plays) {
    expect(controller.state).toBe(GameState.IN_PROGRESS);
    expect(controller.winner).toBe(null);
    expect(controller.currentPlayer.equals(expectedCurrentPlayer)).toBe(true);
    controller.placeStone(cord);
  }
  expect(controller.state).toBe(GameState.COMPLETED);
  expect(controller.winner).toBe(expectedWinner);
}

// eslint-disable-next-line jest/expect-expect
test('can win with ring', () => {
  const controller = new GameController();
  controller.setBoardSize(5);
  controller.startGame();

  const plays: TestPlay[] = [
    {
      cord: new Coordinate({ file: 'i', rank: 7 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'g', rank: 6 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'h', rank: 6 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'f', rank: 6 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'e', rank: 6 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'e', rank: 5 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'd', rank: 4 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'e', rank: 4 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'd', rank: 3 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'f', rank: 5 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'd', rank: 5 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'f', rank: 4 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'f', rank: 7 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'g', rank: 5 }),
      expectedCurrentPlayer: controller.playerTwo
    }
  ];

  expectGame({ controller, plays, expectedWinner: controller.playerTwo });
});

// eslint-disable-next-line jest/expect-expect
test('can win with a bridge', () => {
  const controller = new GameController();
  controller.setBoardSize(5);
  controller.startGame();

  const plays: TestPlay[] = [
    {
      cord: new Coordinate({ file: 'i', rank: 5 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'f', rank: 9 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'h', rank: 4 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'g', rank: 3 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'g', rank: 4 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'e', rank: 9 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'f', rank: 3 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'g', rank: 9 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'e', rank: 2 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'h', rank: 9 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'e', rank: 1 }),
      expectedCurrentPlayer: controller.playerOne
    }
  ];

  expectGame({ controller, plays, expectedWinner: controller.playerOne });
});

// eslint-disable-next-line jest/expect-expect
test('you can win with a fork', () => {
  const controller = new GameController();
  controller.setBoardSize(4);
  controller.startGame();

  const plays: TestPlay[] = [
    {
      cord: new Coordinate({ file: 'd', rank: 7 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'e', rank: 2 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'e', rank: 7 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'f', rank: 3 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'f', rank: 7 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'e', rank: 4 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'f', rank: 6 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'g', rank: 5 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'g', rank: 6 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'c', rank: 6 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'd', rank: 6 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'd', rank: 3 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'c', rank: 5 }),
      expectedCurrentPlayer: controller.playerOne
    },
    {
      cord: new Coordinate({ file: 'a', rank: 4 }),
      expectedCurrentPlayer: controller.playerTwo
    },
    {
      cord: new Coordinate({ file: 'b', rank: 5 }),
      expectedCurrentPlayer: controller.playerOne
    }
  ];
  expectGame({ controller, plays, expectedWinner: controller.playerOne });
});

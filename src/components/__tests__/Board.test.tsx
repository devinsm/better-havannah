import React from 'react';
import Coordinate from 'models/Coordinate';
import {
  render,
  MockGameController,
  within,
  fireEvent,
  Matcher
} from 'test-utils';

import Board from '../Board';
import Player from 'models/Player';
import GameController from 'services/GameController';
import Stone from 'models/Stone';

function getCell({
  cord,
  getByLabelText
}: {
  cord: Coordinate;
  getByLabelText: (label: Matcher) => HTMLElement;
}): HTMLElement {
  // The label will always start with "Cell {file}{rank}"
  // If there is no stone, that will be the whole label
  // If there is a stone, a non digit character will follow (testing for this
  // case is necessary so that "Cell a1" doesn't match "Cell a11")
  const labelPattern = RegExp(`^Cell ${cord.file}${cord.rank}(?:$|\\D)`);
  return getByLabelText(labelPattern);
}

function testInitialState({
  boardSize,
  expectedCells,
  topLeftCorner
}: {
  boardSize: number;
  expectedCells: Coordinate[];
  topLeftCorner: Coordinate;
}): void {
  const { getByLabelText } = render(<Board widthPx={1000} />, {
    services: { gameController: MockGameController({ boardSize }) }
  });

  const board = getByLabelText('Game Board');
  expect(board.getAttribute('role')).toBe('group');

  const boardQueries = within(board);

  for (const cord of expectedCells) {
    const tile = getCell({ cord, getByLabelText: boardQueries.getByLabelText });
    if (cord.file === topLeftCorner.file && cord.rank === topLeftCorner.rank) {
      expect(tile.getAttribute('tabindex')).toBe('0');
    } else {
      expect(tile.getAttribute('tabindex')).toBe('-1');
    }
    expect(tile.getAttribute('role')).toBe('button');
    expect(tile.getAttribute('aria-pressed')).toBe('false');
  }
}
// Disabled jest/expect-expect since the assertions are in a helper function
// eslint-disable-next-line jest/expect-expect
test('base 3 has correct initial state', () => {
  const expectedCells: Coordinate[] = [
    new Coordinate({ file: 'e', rank: 3 }),
    new Coordinate({ file: 'e', rank: 4 }),
    new Coordinate({ file: 'e', rank: 5 }),
    new Coordinate({ file: 'd', rank: 2 }),
    new Coordinate({ file: 'd', rank: 3 }),
    new Coordinate({ file: 'd', rank: 4 }),
    new Coordinate({ file: 'd', rank: 5 }),
    new Coordinate({ file: 'c', rank: 1 }),
    new Coordinate({ file: 'c', rank: 2 }),
    new Coordinate({ file: 'c', rank: 3 }),
    new Coordinate({ file: 'c', rank: 4 }),
    new Coordinate({ file: 'c', rank: 5 }),
    new Coordinate({ file: 'b', rank: 1 }),
    new Coordinate({ file: 'b', rank: 2 }),
    new Coordinate({ file: 'b', rank: 3 }),
    new Coordinate({ file: 'b', rank: 4 }),
    new Coordinate({ file: 'a', rank: 1 }),
    new Coordinate({ file: 'a', rank: 2 }),
    new Coordinate({ file: 'a', rank: 3 })
  ];
  const topLeftCorner = new Coordinate({
    file: 'e',
    rank: 3
  });

  testInitialState({ boardSize: 3, expectedCells, topLeftCorner });
});

// Disabled jest/expect-expect since the assertions are in a helper function
// eslint-disable-next-line jest/expect-expect
test('base 2 board has correct initial state', () => {
  const expectedCells: Coordinate[] = [
    new Coordinate({ file: 'a', rank: 1 }),
    new Coordinate({ file: 'a', rank: 2 }),
    new Coordinate({ file: 'b', rank: 1 }),
    new Coordinate({ file: 'b', rank: 2 }),
    new Coordinate({ file: 'b', rank: 3 }),
    new Coordinate({ file: 'c', rank: 2 }),
    new Coordinate({ file: 'c', rank: 3 })
  ];
  const topLeftCorner = new Coordinate({
    file: 'c',
    rank: 2
  });

  testInitialState({ boardSize: 2, expectedCells, topLeftCorner });
});

test('can navigate via "a", "s", "d", "e", "w", "q" keys', () => {
  // a => down & left
  // s => down
  // d => down & right
  // e => up & right
  // w => up
  // q => up & left
  const { getByLabelText } = render(<Board widthPx={1000} />, {
    services: { gameController: MockGameController({ boardSize: 6 }) }
  });

  const navPath: { expectedCurrentFocus: Coordinate; keyToPress: string }[] = [
    {
      expectedCurrentFocus: new Coordinate({ file: 'k', rank: 6 }),
      keyToPress: 'w'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'k', rank: 6 }),
      keyToPress: 'q'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'k', rank: 6 }),
      keyToPress: 'a'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'k', rank: 6 }),
      keyToPress: 's'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'j', rank: 5 }),
      keyToPress: 's'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'i', rank: 4 }),
      keyToPress: 's'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'h', rank: 3 }),
      keyToPress: 's'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'g', rank: 2 }),
      keyToPress: 's'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'f', rank: 1 }),
      keyToPress: 's'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'f', rank: 1 }),
      keyToPress: 'd'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'e', rank: 1 }),
      keyToPress: 'd'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'd', rank: 1 }),
      keyToPress: 'd'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'c', rank: 1 }),
      keyToPress: 'd'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'b', rank: 1 }),
      keyToPress: 'd'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'a', rank: 1 }),
      keyToPress: 'd'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'a', rank: 1 }),
      keyToPress: 'e'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'a', rank: 2 }),
      keyToPress: 'e'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'a', rank: 3 }),
      keyToPress: 'e'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'a', rank: 4 }),
      keyToPress: 'e'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'a', rank: 5 }),
      keyToPress: 'e'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'a', rank: 6 }),
      keyToPress: 'e'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'a', rank: 6 }),
      keyToPress: 'w'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'b', rank: 7 }),
      keyToPress: 'w'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'c', rank: 8 }),
      keyToPress: 'w'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'd', rank: 9 }),
      keyToPress: 'w'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'e', rank: 10 }),
      keyToPress: 'w'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'f', rank: 11 }),
      keyToPress: 'w'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'f', rank: 11 }),
      keyToPress: 'q'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'g', rank: 11 }),
      keyToPress: 'q'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'h', rank: 11 }),
      keyToPress: 'q'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'i', rank: 11 }),
      keyToPress: 'q'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'j', rank: 11 }),
      keyToPress: 'q'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'k', rank: 11 }),
      keyToPress: 'q'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'k', rank: 11 }),
      keyToPress: 'a'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'k', rank: 10 }),
      keyToPress: 'a'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'k', rank: 9 }),
      keyToPress: 'a'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'k', rank: 8 }),
      keyToPress: 'a'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'k', rank: 7 }),
      keyToPress: 'a'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'k', rank: 6 }),
      keyToPress: 'a'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'k', rank: 6 }),
      keyToPress: 'd'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'j', rank: 6 }),
      keyToPress: 'd'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'i', rank: 6 }),
      keyToPress: 'd'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'h', rank: 6 }),
      keyToPress: 's'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'g', rank: 5 }),
      keyToPress: 'a'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'g', rank: 4 }),
      keyToPress: 'q'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'h', rank: 4 }),
      keyToPress: 'w'
    },
    {
      expectedCurrentFocus: new Coordinate({ file: 'i', rank: 5 }),
      keyToPress: 'w'
    }
  ];

  getCell({
    cord: new Coordinate({ file: 'k', rank: 6 }),
    getByLabelText
  }).focus();

  for (let i = 0; i < navPath.length; i++) {
    const current = navPath[i];
    const expectedFocusedElement = getCell({
      cord: current.expectedCurrentFocus,
      getByLabelText
    });
    expect(expectedFocusedElement.getAttribute('tabindex')).toBe('0');
    expect(expectedFocusedElement).toHaveFocus();
    if (i > 0) {
      const prev = navPath[i - 1];
      if (!prev.expectedCurrentFocus.equals(current.expectedCurrentFocus)) {
        const prevCell = getCell({
          cord: prev.expectedCurrentFocus,
          getByLabelText
        });
        expect(prevCell.getAttribute('tabindex')).toBe('-1');
      }
    }

    fireEvent.keyDown(expectedFocusedElement, { key: current.keyToPress });
  }
});

function testPlaceStone({
  gameController,
  cord,
  fireClickEvent,
  shouldSucceed
}: {
  gameController: GameController;
  cord: Coordinate;
  fireClickEvent: (element: Element | Node) => void;
  shouldSucceed: boolean;
}): void {
  const { getByLabelText } = render(<Board widthPx={1000} />, {
    services: { gameController }
  });

  const cellToClick = getCell({
    cord,
    getByLabelText
  });
  fireClickEvent(cellToClick);

  const mockPlaceStone = gameController.placeStone as jest.Mock;
  if (shouldSucceed) {
    expect(mockPlaceStone.mock.calls.length).toBe(1);
    expect(mockPlaceStone.mock.calls[0].length).toBe(1);
    const cordWhereStonePlaced: Coordinate = mockPlaceStone.mock.calls[0][0];
    expect(cordWhereStonePlaced.equals(cord)).toBeTruthy();
  } else {
    expect(mockPlaceStone.mock.calls.length).toBe(0);
  }
}

// eslint-disable-next-line jest/expect-expect
test('The game controller is notified when the user places a stone', () => {
  const gameController = MockGameController({ boardSize: 5 });
  (gameController.canPlaceStone as jest.Mock).mockImplementation(() => true);

  testPlaceStone({
    gameController,
    cord: new Coordinate({ file: 'e', rank: 6 }),
    fireClickEvent: fireEvent.click,
    shouldSucceed: true
  });
});

// eslint-disable-next-line jest/expect-expect
test('Does not place stone when disabled', () => {
  const gameController = MockGameController({ boardSize: 5 });
  (gameController.canPlaceStone as jest.Mock).mockImplementation(() => false);

  testPlaceStone({
    gameController,
    cord: new Coordinate({ file: 'e', rank: 6 }),
    fireClickEvent: fireEvent.click,
    shouldSucceed: false
  });
});

// eslint-disable-next-line jest/expect-expect
test('can click cell using enter key', () => {
  const gameController = MockGameController({ boardSize: 5 });
  (gameController.canPlaceStone as jest.Mock).mockImplementation(() => true);

  testPlaceStone({
    gameController,
    cord: new Coordinate({ file: 'c', rank: 5 }),
    fireClickEvent: el => fireEvent.keyDown(el, { key: 'Enter' }),
    shouldSucceed: true
  });
});

// eslint-disable-next-line jest/expect-expect
test('can click cell using space bar', () => {
  const gameController = MockGameController({ boardSize: 5 });
  (gameController.canPlaceStone as jest.Mock).mockImplementation(() => true);

  testPlaceStone({
    gameController,
    cord: new Coordinate({ file: 'c', rank: 5 }),
    fireClickEvent: el => {
      fireEvent.keyDown(el, { key: ' ' });
      fireEvent.keyUp(el, { key: ' ' });
    },
    shouldSucceed: true
  });
});

// eslint-disable-next-line jest/expect-expect
test('hitting other keys does not place stone', () => {
  const gameController = MockGameController({ boardSize: 5 });
  (gameController.canPlaceStone as jest.Mock).mockImplementation(() => true);

  testPlaceStone({
    gameController,
    cord: new Coordinate({ file: 'c', rank: 5 }),
    fireClickEvent: el => fireEvent.keyDown(el, { key: 'x' }),
    shouldSucceed: false
  });
});

test('stones shown appropriately', () => {
  const gameController = MockGameController({ boardSize: 5 });
  const cordWithOnesStone = new Coordinate({ file: 'c', rank: 4 });
  const cordWithTwosStone = new Coordinate({ file: 'a', rank: 2 });
  const cordWithNoStone = new Coordinate({ file: 'e', rank: 4 });
  (gameController.getStone as jest.Mock).mockImplementation((cord: Coordinate):
    | Stone
    | undefined => {
    if (cord.equals(cordWithOnesStone)) {
      return new Stone({
        location: cordWithOnesStone,
        owner: new Player('one')
      });
    }
    if (cord.equals(cordWithTwosStone)) {
      return new Stone({
        location: cordWithOnesStone,
        owner: new Player('two')
      });
    }
    return undefined;
  });

  const { getByLabelText } = render(<Board widthPx={1000} />, {
    services: { gameController }
  });

  const cellWithOnesStone = getCell({
    cord: cordWithOnesStone,
    getByLabelText
  });
  const cellWithTwosStone = getCell({
    cord: cordWithTwosStone,
    getByLabelText
  });
  const cellWithNoStone = getCell({
    cord: cordWithNoStone,
    getByLabelText
  });

  const labelPrefix = (cord: Coordinate): string =>
    `Cell ${cord.file}${cord.rank}`;

  expect(cellWithOnesStone.getAttribute('aria-label')).toBe(
    `${labelPrefix(cordWithOnesStone)} (has player one's stone)`
  );
  expect(cellWithTwosStone.getAttribute('aria-label')).toBe(
    `${labelPrefix(cordWithTwosStone)} (has player two's stone)`
  );
  expect(cellWithNoStone.getAttribute('aria-label')).toBe(
    `${labelPrefix(cordWithNoStone)}`
  );

  const { queryByLabelText: queryOurStone } = within(cellWithOnesStone);
  const { queryByLabelText: queryTheirStone } = within(cellWithTwosStone);
  const { queryByLabelText: queryNoStone } = within(cellWithNoStone);
  const ourStone = queryOurStone('stone');
  expect(ourStone).toBeDefined();

  const theirStone = queryTheirStone('stone');
  expect(theirStone).toBeDefined();

  const noStone = queryNoStone('stone');
  expect(noStone).toBeDefined();
});

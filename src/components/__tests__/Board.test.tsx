import React from 'react';
import GameController from 'services/GameController';
import { within, fireEvent, Matcher } from '@testing-library/dom';
import Coordinate from 'models/Coordinate';
import { createMuiTheme } from '@material-ui/core/styles';
import { render } from 'test-utils';
import Board from '../Board';

const theme = createMuiTheme();

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
  const gameController = new GameController();
  const boardSizeGetter = jest.spyOn(gameController, 'boardSize', 'get');
  boardSizeGetter.mockImplementation(() => boardSize);

  const { getByLabelText } = render(<Board widthPx={1000} />, {
    services: { gameController },
    theme
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
    expect(tile).toHaveStyle(`
      fill: ${theme.palette.background.paper};
    `);
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
  const gameController = new GameController();
  const boardSizeGetter = jest.spyOn(gameController, 'boardSize', 'get');
  boardSizeGetter.mockImplementation(() => 6);

  const { getByLabelText } = render(<Board widthPx={1000} />, {
    services: { gameController },
    theme
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

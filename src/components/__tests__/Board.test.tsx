import React from 'react';
import GameController from 'services/GameController';
import { within } from '@testing-library/dom';
import Coordinate from 'models/Coordinate';
import { createMuiTheme } from '@material-ui/core/styles';

import { render } from 'test-utils';
// import { within } from '@testing-library/dom';
import Board from '../Board';
// import Coordinate from 'models/Coordinate';

const theme = createMuiTheme();

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
    const tile = boardQueries.getByLabelText(`Cell ${cord.file}${cord.rank}`);
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

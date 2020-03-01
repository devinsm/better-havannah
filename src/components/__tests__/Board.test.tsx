import React from 'react';
import GameController from 'services/GameController';
import { within } from '@testing-library/dom';
import Coordinate from 'models/Coordinate';

import { render } from 'test-utils';
// import { within } from '@testing-library/dom';
import Board from '../Board';
// import Coordinate from 'models/Coordinate';

test('board (base 3) renders all tiles', () => {
  const gameController = new GameController();
  const boardSizeGetter = jest.spyOn(gameController, 'boardSize', 'get');
  boardSizeGetter.mockImplementation(() => 3);

  const { getByLabelText } = render(<Board />, {
    services: { gameController }
  });

  const board = getByLabelText('Game Board');
  expect(board.getAttribute('role')).toBe('group');

  const boardQueries = within(board);

  const cords: Coordinate[] = [
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

  for (const cord of cords) {
    const tile = boardQueries.getByLabelText(`Cell ${cord.file}${cord.rank}`);
    expect(tile.getAttribute('role')).toBe('button');
    expect(tile.getAttribute('aria-pressed')).toBe('false');
  }
});

import React from 'react';
import GameController from 'services/GameController';

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

  // const boardQueries = within(board);

  // const cords: Coordinate[] = [
  //   new Coordinate({ row: 0, col: 2 }),
  //   new Coordinate({ row: 1, col: 1 }),
  //   new Coordinate({ row: 1, col: 3 }),
  //   new Coordinate({ row: 2, col: 0 }),
  //   new Coordinate({ row: 2, col: 2 }),
  //   new Coordinate({ row: 2, col: 4 }),
  //   new Coordinate({ row: 3, col: 1 }),
  //   new Coordinate({ row: 3, col: 3 }),
  //   new Coordinate({ row: 4, col: 0 }),
  //   new Coordinate({ row: 4, col: 2 }),
  //   new Coordinate({ row: 4, col: 4 }),
  //   new Coordinate({ row: 5, col: 1 }),
  //   new Coordinate({ row: 5, col: 3 }),
  //   new Coordinate({ row: 6, col: 0 }),
  //   new Coordinate({ row: 6, col: 2 }),
  //   new Coordinate({ row: 6, col: 4 }),
  //   new Coordinate({ row: 7, col: 1 }),
  //   new Coordinate({ row: 7, col: 3 }),
  //   new Coordinate({ row: 8, col: 2 })
  // ];

  // for (const cord of cords) {
  //   const tile = boardQueries.getByLabelText(
  //     `Cell: rank ${cord.col + 1}, file ${cord.row + 1}`
  //   );
  //   expect(tile.getAttribute('role')).toBe('button');
  //   expect(tile.getAttribute('aria-pressed')).toBe('false');
  // }
});

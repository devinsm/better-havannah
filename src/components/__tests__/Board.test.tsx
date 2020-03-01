import React from 'react';
import GameController from 'services/GameController';

import { render } from 'test-utils';
import Board from '../Board';

test('board (base 3) renders all tiles', () => {
  const gameController = new GameController();
  const boardSizeGetter = jest.spyOn(gameController, 'boardSize', 'get');
  boardSizeGetter.mockImplementation(() => 3);

  const { getByLabelText } = render(<Board />, {
    services: { gameController }
  });

  const board = getByLabelText('Game Board');
  expect(board.getAttribute('role')).toBe('group');
});

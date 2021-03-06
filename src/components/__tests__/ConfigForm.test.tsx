import React from 'react';
import { render, MockGameController, within, fireEvent } from 'test-utils';

import ConfigForm from '../ConfigForm';
import { GameState } from 'services/GameController';

test('it renders the appropriate heading', () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.NOT_STARTED
  });

  const { getByText } = render(<ConfigForm />, {
    services: { gameController }
  });
  const heading = getByText('To begin select a board size!');
  // Important to not miss heading levels
  expect(
    heading.nodeName === 'H2' ||
      (heading.getAttribute('role') === 'heading' &&
        heading.getAttribute('aria-level') === '2')
  ).toBeTruthy();
});

test('it renders a select box with board sizes', () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.NOT_STARTED
  });

  const { getByLabelText } = render(<ConfigForm />, {
    services: { gameController }
  });
  const boardSizeSelect = getByLabelText(/^board size$/i);
  expect(
    boardSizeSelect.nodeName === 'SELECT' ||
      boardSizeSelect.getAttribute('role') === 'listbox'
  ).toBeTruthy();

  const expectedOptions = ['5', '6', '7', '8', '9', '10'];
  const { getByText: getByTextInsideSelect } = within(boardSizeSelect);
  for (const option of expectedOptions) {
    const optionEl = getByTextInsideSelect(option) as HTMLElement;
    expect(
      optionEl.nodeName === 'OPTION' ||
        optionEl.getAttribute('role') === 'option'
    ).toBeTruthy();
  }
});

test('selecting an option changes board size', () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.NOT_STARTED
  });

  const { getByLabelText } = render(<ConfigForm />, {
    services: { gameController }
  });
  const boardSizeSelect = getByLabelText(/^board size$/i);

  fireEvent.change(boardSizeSelect, { target: { value: '9' } });

  const mockSetBoardSize = gameController.setBoardSize as jest.Mock;
  expect(mockSetBoardSize.mock.calls.length).toBe(1);
  expect(mockSetBoardSize.mock.calls[0].length).toBe(1);
  expect(mockSetBoardSize.mock.calls[0][0]).toBe(9);
});

const startGameMatcher = (text: string, node: HTMLElement): boolean => {
  const hasMatchingText = /start game/i.test(node.textContent || '');
  const isButton =
    node.nodeName === 'BUTTON' || node.getAttribute('role') === 'button';
  return hasMatchingText && isButton;
};

test('it renders start game button', () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.NOT_STARTED
  });

  const { getByText } = render(<ConfigForm />, {
    services: { gameController }
  });
  // function text match needed since button text is nested within a span
  const startGameButton = getByText(startGameMatcher);
  expect(startGameButton).toBeTruthy();
});
test('clicking start game starts game', () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.NOT_STARTED
  });

  const { getByText } = render(<ConfigForm />, {
    services: { gameController }
  });
  // function text match needed since button text is nested within a span
  const startGameButton = getByText(startGameMatcher);

  fireEvent.click(startGameButton);

  const mockStartGame = gameController.startGame as jest.Mock;
  expect(mockStartGame.mock.calls.length).toBe(1);
  expect(mockStartGame.mock.calls[0].length).toBe(0);
});

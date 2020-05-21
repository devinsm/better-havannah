import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { render, MockGameController } from 'test-utils';
import { within, fireEvent } from '@testing-library/react';

import ConfigForm from '../ConfigForm';
import { GameState } from 'services/GameController';

const theme = createMuiTheme();

test('it renders the appropriate heading', () => {
  const gameController = MockGameController(5);
  gameController.state = GameState.NOT_STARTED;

  const { getByText } = render(<ConfigForm />, {
    services: { gameController },
    theme
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
  const gameController = MockGameController(5);
  gameController.state = GameState.NOT_STARTED;

  const { getByLabelText } = render(<ConfigForm />, {
    services: { gameController },
    theme
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

test('it renders start game button', () => {
  const gameController = MockGameController(5);
  gameController.state = GameState.NOT_STARTED;

  const { getByText } = render(<ConfigForm />, {
    services: { gameController },
    theme
  });
  // function text match needed since button text is nested within a span
  const startGameButton = getByText((text, node: HTMLElement) => {
    const hasMatchingText = /start game/i.test(node.textContent || '');
    const isButton =
      node.nodeName === 'BUTTON' || node.getAttribute('role') === 'button';
    return hasMatchingText && isButton;
  });
  expect(startGameButton).toBeTruthy();
});

test('selecting an option changes board size', () => {
  const gameController = MockGameController(5);
  gameController.state = GameState.NOT_STARTED;

  const { getByLabelText } = render(<ConfigForm />, {
    services: { gameController },
    theme
  });
  const boardSizeSelect = getByLabelText(/^board size$/i);

  fireEvent.change(boardSizeSelect, { target: { value: '9' } });

  const mockSetBoardSize = gameController.setBoardSize as jest.Mock;
  expect(mockSetBoardSize.mock.calls.length).toBe(1);
  expect(mockSetBoardSize.mock.calls[0].length).toBe(1);
  expect(mockSetBoardSize.mock.calls[0][0]).toBe(9);
});

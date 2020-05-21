import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { render, MockGameController } from 'test-utils';
import { Matcher } from '@testing-library/dom';

import { GameState } from 'services/GameController';
import Player from 'models/Player';
import MessageBoard from 'components/MessageBoard';
import difference from 'lodash/difference';

const theme = createMuiTheme();

const thinkingMsgRegex = /bot is thinking/i;
const winMsgRegex = /you win/i;
const loseMsgRegex = /you lose/i;
const drawMsgRegex = /you tied/i;

function assertCorrectMessage({
  msgRegex,
  queryByText
}: {
  msgRegex?: RegExp;
  queryByText: (text: Matcher) => HTMLElement | null;
}): void {
  const allOtherRegex = difference(
    [thinkingMsgRegex, winMsgRegex, loseMsgRegex, drawMsgRegex],
    msgRegex ? [msgRegex] : []
  );

  if (msgRegex) {
    const expectedMessage = queryByText(msgRegex);
    expect(expectedMessage).toBeTruthy();
  }

  for (const otherMsgRegex of allOtherRegex) {
    const unexpectedMessage = queryByText(otherMsgRegex);
    expect(unexpectedMessage).toBeFalsy();
  }
}

// eslint-disable-next-line jest/expect-expect
test('lets user know when bot is thinking', () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.IN_PROGRESS,
    currentPlayer: new Player('bot')
  });

  const { queryByText } = render(<MessageBoard />, {
    services: { gameController },
    theme
  });

  assertCorrectMessage({ msgRegex: thinkingMsgRegex, queryByText });
});

// eslint-disable-next-line jest/expect-expect
test('does not show thinking message when not thinking', () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.IN_PROGRESS,
    currentPlayer: new Player('human')
  });

  const { queryByText } = render(<MessageBoard />, {
    services: { gameController },
    theme
  });

  assertCorrectMessage({ queryByText });
});

// eslint-disable-next-line jest/expect-expect
test('shows message when user wins', () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.COMPLETED,
    winner: new Player('human')
  });

  const { queryByText } = render(<MessageBoard />, {
    services: { gameController },
    theme
  });

  assertCorrectMessage({ msgRegex: winMsgRegex, queryByText });
});

// eslint-disable-next-line jest/expect-expect
test('shows message when user loses', () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.COMPLETED,
    winner: new Player('bot')
  });

  const { queryByText } = render(<MessageBoard />, {
    services: { gameController },
    theme
  });

  assertCorrectMessage({ msgRegex: loseMsgRegex, queryByText });
});

// eslint-disable-next-line jest/expect-expect
test('shows message when draw', () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.COMPLETED,
    winner: null
  });

  const { queryByText } = render(<MessageBoard />, {
    services: { gameController },
    theme
  });

  assertCorrectMessage({ msgRegex: drawMsgRegex, queryByText });
});

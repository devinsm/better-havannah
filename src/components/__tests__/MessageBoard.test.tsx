import React from 'react';
import { render, MockGameController, Matcher } from 'test-utils';

import { GameState } from 'services/GameController';
import Player from 'models/Player';
import MessageBoard from 'components/MessageBoard';
import difference from 'lodash/difference';

const playerOnesTurnRegex = /player one's turn/i;
const playerTwosTurnRegex = /player two's turn/i;
const playerOneWinsRegex = /player one wins/i;
const playerTwoWinsRegex = /player two wins/i;
const drawMsgRegex = /you tied/i;

function assertCorrectMessage({
  msgRegex,
  queryByText
}: {
  msgRegex?: RegExp;
  queryByText: (text: Matcher) => HTMLElement | null;
}): void {
  const allOtherRegex = difference(
    [
      playerOnesTurnRegex,
      playerTwosTurnRegex,
      playerOneWinsRegex,
      playerTwoWinsRegex,
      drawMsgRegex
    ],
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
test("lets users know when it is player one's turn", () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.IN_PROGRESS,
    currentPlayer: new Player('one')
  });

  const { queryByText } = render(<MessageBoard />, {
    services: { gameController }
  });

  assertCorrectMessage({ msgRegex: playerOnesTurnRegex, queryByText });
});

// eslint-disable-next-line jest/expect-expect
test("lets users know when it is player two's turn", () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.IN_PROGRESS,
    currentPlayer: new Player('two')
  });

  const { queryByText } = render(<MessageBoard />, {
    services: { gameController }
  });

  assertCorrectMessage({ msgRegex: playerTwosTurnRegex, queryByText });
});

// eslint-disable-next-line jest/expect-expect
test('shows message when player one wins', () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.COMPLETED,
    winner: new Player('one')
  });

  const { queryByText } = render(<MessageBoard />, {
    services: { gameController }
  });

  assertCorrectMessage({ msgRegex: playerOneWinsRegex, queryByText });
});

// eslint-disable-next-line jest/expect-expect
test('shows message when player two wins', () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.COMPLETED,
    winner: new Player('two')
  });

  const { queryByText } = render(<MessageBoard />, {
    services: { gameController }
  });

  assertCorrectMessage({ msgRegex: playerTwoWinsRegex, queryByText });
});

// eslint-disable-next-line jest/expect-expect
test('shows message when draw', () => {
  const gameController = MockGameController({
    boardSize: 5,
    state: GameState.COMPLETED,
    winner: null
  });

  const { queryByText } = render(<MessageBoard />, {
    services: { gameController }
  });

  assertCorrectMessage({ msgRegex: drawMsgRegex, queryByText });
});

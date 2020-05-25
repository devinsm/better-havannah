import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Services, ServiceContext } from 'services/ServiceContainer';
import { ThemeProvider, Theme } from '@material-ui/core/styles';

import Board from 'models/Board';
import Player from 'models/Player';
import GameController, { GameState } from 'services/GameController';

const getAppWrapper = ({
  services,
  theme
}: {
  services: Services;
  theme?: Theme;
}): React.ComponentType => {
  const AppWrapper = ({
    children
  }: {
    children?: React.ReactNode;
  }): React.ReactElement => {
    const wrappedInServices = (
      <ServiceContext.Provider value={services}>
        {children}
      </ServiceContext.Provider>
    );
    if (theme) {
      return <ThemeProvider theme={theme}>{wrappedInServices}</ThemeProvider>;
    }
    return wrappedInServices;
  };
  return AppWrapper;
};

const customRender = (
  ui: React.ReactElement,
  options: Omit<RenderOptions, 'queries' | 'wrapper'> & {
    services: Services;
    theme: Theme;
  }
): RenderResult =>
  render(ui, {
    wrapper: getAppWrapper({ services: options.services }),
    ...options
  });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };

// Mock services which can be used and injected by tests
export const MockGameController = ({
  boardSize,
  state,
  currentPlayer,
  winner
}: {
  boardSize: number;
  state?: GameState;
  currentPlayer?: Player;
  winner?: Player | null;
}): GameController =>
  (({
    board: new Board(boardSize),
    state: state || GameState.IN_PROGRESS,
    playerOne: new Player('one'),
    playerTwo: new Player('two'),
    currentPlayer: currentPlayer || new Player('one'),
    winner: winner || null,
    setBoardSize: jest.fn(),
    placeStone: jest.fn(),
    canPlaceStone: jest.fn(),
    getStone: jest.fn(),
    startGame: jest.fn()
  } as unknown) as GameController);

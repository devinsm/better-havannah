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
export const MockGameController = (boardSize: number): GameController =>
  (({
    board: new Board(boardSize),
    state: GameState.IN_PROGRESS,
    us: new Player('human'),
    them: new Player('bot'),
    currentPlayer: new Player('human'),
    setBoardSize: jest.fn(),
    placeStone: jest.fn(),
    canPlaceStone: jest.fn(),
    getStone: jest.fn()
  } as unknown) as GameController);

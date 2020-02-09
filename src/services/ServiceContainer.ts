import React from 'react';
import GameController from './GameController';

export interface Services {
  gameController: GameController | null;
}

export const ServiceContext = React.createContext<Services>({
  gameController: null
});

import React from 'react';
import GameController from './GameController';

interface NullableServices {
  gameController?: GameController;
}

export const ServiceContext = React.createContext<NullableServices>({
  gameController: undefined
});

export interface Services extends NullableServices {
  gameController: GameController;
}

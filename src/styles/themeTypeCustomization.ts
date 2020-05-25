import { Theme } from '@material-ui/core/styles/createMuiTheme';

import StoneColor from './StoneColor';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    stoneColors: {
      one: StoneColor;
      two: StoneColor;
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    stoneColors?: {
      one?: StoneColor;
      two?: StoneColor;
    };
  }
}

import './themeTypeCustomization';
import { createMuiTheme, ThemeOptions, Theme } from '@material-ui/core/styles';

export default function createTheme(options?: ThemeOptions): Theme {
  return createMuiTheme({
    stoneColors: {
      one: {
        main: '#000',
        sunspot: '#a0a0a0'
      },
      two: {
        main: '#721817',
        sunspot: '#ff3633'
      }
    },
    ...options
  });
}

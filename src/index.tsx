import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ServiceContext } from 'services/ServiceContainer';
import GameController from 'services/GameController';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  ThemeProvider,
  createMuiTheme,
  responsiveFontSizes
} from '@material-ui/core/styles';
import * as serviceWorker from './serviceWorker';
require('typeface-berkshire-swash');

const WrappedApp: React.ComponentType = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const headerFontFamily = "'Berkshire Swash', cursive";
  const theme = React.useMemo(
    () =>
      responsiveFontSizes(
        createMuiTheme({
          palette: {
            type: prefersDarkMode ? 'dark' : 'light'
          },
          typography: {
            h1: {
              fontFamily: headerFontFamily
            },
            h2: {
              fontFamily: headerFontFamily
            },
            h3: {
              fontFamily: headerFontFamily
            },
            h4: {
              fontFamily: headerFontFamily
            },
            h5: {
              fontFamily: headerFontFamily
            },
            h6: {
              fontFamily: headerFontFamily
            }
          }
        })
      ),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <ServiceContext.Provider value={{ gameController: new GameController() }}>
        <App />
      </ServiceContext.Provider>
    </ThemeProvider>
  );
};

ReactDOM.render(<WrappedApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

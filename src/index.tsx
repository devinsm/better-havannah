import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import 'mobx-react/batchingForReactDom';

import App from './App';
import { ServiceContext } from 'services/ServiceContainer';
import GameController from 'services/GameController';
import * as serviceWorker from './serviceWorker';
import createTheme from 'styles/createTheme';

require('typeface-berkshire-swash');

const WrappedApp: React.ComponentType = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const headerFontFamily = "'Berkshire Swash', cursive";
  const theme = React.useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: {
            type: prefersDarkMode ? 'dark' : 'light',
            primary: {
              main: prefersDarkMode ? '#b794f6' : '#3f51b5'
            },
            secondary: {
              main: prefersDarkMode ? '#c6f68d' : '#f50057'
            }
          },
          typography: {
            h1: {
              fontFamily: headerFontFamily
            },
            h2: {
              fontFamily: headerFontFamily,
              fontSize: '2rem'
            },
            h3: {
              fontFamily: headerFontFamily,
              fontSize: '1.5rem'
            }
          },
          props: {
            MuiTypography: {
              color: 'textPrimary'
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

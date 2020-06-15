import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import 'mobx-react/batchingForReactDom';

import App from './App';
import DarkModeSwitch from 'components/DarkModeSwitch';
import { ServiceContext, Services } from 'services/ServiceContainer';
import GameController from 'services/GameController';
import createTheme from 'styles/createTheme';
import GitHubLink from 'components/GitHubLink';

require('typeface-berkshire-swash');

const WrappedApp: React.ComponentType = () => {
  const services = useMemo<Services>(() => {
    return { gameController: new GameController() };
  }, []);
  const [inDarkMode, setInDarkMode] = useState<boolean>(false);
  const headerFontFamily = "'Berkshire Swash', cursive";
  const theme = React.useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: {
            type: inDarkMode ? 'dark' : 'light',
            primary: {
              main: inDarkMode ? '#b794f6' : '#3f51b5'
            },
            secondary: {
              main: inDarkMode ? '#c6f68d' : '#f50057'
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
    [inDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <ServiceContext.Provider value={services}>
        <DarkModeSwitch
          inDarkMode={inDarkMode}
          toggleInDarkMode={(): void => setInDarkMode(!inDarkMode)}
        />
        <GitHubLink />
        <App />
      </ServiceContext.Provider>
    </ThemeProvider>
  );
};

ReactDOM.render(<WrappedApp />, document.getElementById('root'));

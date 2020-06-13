import React from 'react';
import { IconButton } from '@material-ui/core';
import {
  withTheme,
  withStyles,
  WithStyles,
  createStyles,
  ThemeProvider,
  Theme
} from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import createTheme from 'styles/createTheme';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ palette, zIndex }: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      top: 0,
      right: 0
    },
    button: {
      zIndex: zIndex.speedDial
    },
    gitHubMarkLogo: {
      fill: palette.type === 'dark' ? '#0f0c0d' : palette.common.white,
      width: '32.579px',
      height: '31.775px'
    },
    cornerTriangle: {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: zIndex.mobileStepper,
      width: 0,
      height: 0,
      borderTop: `100px solid ${
        palette.type === 'dark' ? palette.common.white : palette.common.black
      }`,
      borderLeft: `100px solid transparent`
    }
  });

export interface GitHubMarkLogoProps extends WithStyles<typeof styles> {
  theme: Theme;
  className?: string;
}

const GitHubMarkLogo: React.ComponentType<GitHubMarkLogoProps> = ({
  theme,
  classes,
  className
}: GitHubMarkLogoProps) => {
  // The IconButton appears over a dark background when we use the light theme
  // and a light background when we use a dark theme. This is not what the
  // IconButton expects, and therefore the focus styles are wrong. We fix this
  // by flipping the theme for that single component.
  const flippedTheme = createTheme({
    palette: {
      type: theme.palette.type === 'dark' ? 'light' : 'dark'
    }
  });
  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.cornerTriangle} />
      <ThemeProvider theme={flippedTheme}>
        <IconButton
          component="a"
          href="https://github.com/devinsm/better-havannah"
          aria-label="GitHub repository"
          className={classes.button}
        >
          <svg viewBox="0 0 32.579 31.775" className={classes.gitHubMarkLogo}>
            <path
              d="M152.608,107.44a16.291,16.291,0,0,0-5.148,31.747c.815.149,1.112-.353,1.112-.785,0-.387-.014-1.411-.022-2.771-4.531.985-5.487-2.183-5.487-2.183a4.315,4.315,0,0,0-1.809-2.383c-1.479-1.011.112-.99.112-.99a3.42,3.42,0,0,1,2.495,1.678,3.468,3.468,0,0,0,4.741,1.354,3.482,3.482,0,0,1,1.034-2.178c-3.617-.411-7.42-1.808-7.42-8.051a6.3,6.3,0,0,1,1.677-4.371,5.852,5.852,0,0,1,.16-4.311s1.367-.438,4.479,1.67a15.448,15.448,0,0,1,8.156,0c3.11-2.108,4.475-1.67,4.475-1.67a5.854,5.854,0,0,1,.163,4.311A6.286,6.286,0,0,1,163,122.878c0,6.258-3.809,7.635-7.438,8.038a3.889,3.889,0,0,1,1.106,3.017c0,2.178-.02,3.935-.02,4.469,0,.435.294.942,1.12.783a16.292,16.292,0,0,0-5.16-31.745Z"
              transform="translate(-136.32 -107.44)"
              fillRule="evenodd"
            />
          </svg>
        </IconButton>
      </ThemeProvider>
    </div>
  );
};

export default withStyles(styles)(withTheme(observer(GitHubMarkLogo)));

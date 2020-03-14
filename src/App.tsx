import React, { useState, useEffect } from 'react';
import Board from 'components/Board';
import { Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import debounce from 'lodash/debounce';

const MAX_CONTENT_WIDTH_PX = 1100;
const CONTENT_PADDING_PX = 16;
const useAppStyles = makeStyles(theme =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      minHeight: '100%',
      padding: '1px 0',
      display: 'flex',
      justifyContent: 'center'
    },
    content: {
      maxWidth: `${MAX_CONTENT_WIDTH_PX}px`,
      padding: `${CONTENT_PADDING_PX}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  })
);

const App: React.ComponentType = () => {
  const styleClasses = useAppStyles();
  const [boardWidthPx, setBoardWidth] = useState(MAX_CONTENT_WIDTH_PX);
  const updateBoardWidth = (): void => {
    const viewPortWidthPx = document.documentElement.clientWidth;
    const newWidth =
      Math.min(MAX_CONTENT_WIDTH_PX, viewPortWidthPx) - 2 * CONTENT_PADDING_PX;
    setBoardWidth(newWidth);
  };
  useEffect(updateBoardWidth, []);
  useEffect(() => {
    const adjustBoardWidth: () => void = debounce(updateBoardWidth, 50, {
      maxWait: 500
    });
    window.addEventListener('resize', adjustBoardWidth);
    return (): void => window.removeEventListener('resize', adjustBoardWidth);
  });
  return (
    <div className={styleClasses.root}>
      <div className={styleClasses.content}>
        <Typography variant="h1">Havannah</Typography>
        <Board widthPx={boardWidthPx} />
      </div>
    </div>
  );
};

export default App;

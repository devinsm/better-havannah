import React, { useState, useEffect, useContext } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import debounce from 'lodash/debounce';
import { observer } from 'mobx-react';

import { ServiceContext, Services } from 'services/ServiceContainer';
import Board from 'components/Board';
import InformationPanels from 'components/InformationPanels';
import MessageBoard from 'components/MessageBoard';
import ConfigForm from 'components/ConfigForm';
import Roster from 'components/Roster';
import { GameState } from 'services/GameController';

const MAX_CONTENT_WIDTH_PX = 1100;
const CONTENT_PADDING_PX = 16;
const useAppStyles = makeStyles(({ palette, spacing, zIndex }: Theme) =>
  createStyles({
    root: {
      backgroundColor: palette.background.default,
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
    },
    infoPanels: {
      marginBottom: spacing(5),
      marginTop: spacing(4)
    },
    configForm: {
      marginBottom: spacing(8)
    },
    roster: {
      position: 'absolute',
      zIndex: zIndex.snackbar,
      top: 0,
      left: 0
    },
    messageBoardContainer: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginBottom: spacing(8)
    }
  })
);

const App: React.ComponentType = () => {
  const { gameController } = useContext(ServiceContext) as Services;
  const classes = useAppStyles();
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
    <div className={classes.root}>
      <div className={classes.content}>
        <Typography variant="h1">Havannah</Typography>
        <InformationPanels classes={{ root: classes.infoPanels }} />
        {gameController.state === GameState.NOT_STARTED ? (
          <ConfigForm classes={{ root: classes.configForm }} />
        ) : (
          <div className={classes.messageBoardContainer}>
            <Roster classes={{ root: classes.roster }} />
            <MessageBoard />
          </div>
        )}
        <Board widthPx={boardWidthPx} />
      </div>
    </div>
  );
};

export default observer(App);

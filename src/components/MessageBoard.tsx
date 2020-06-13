import React, { useContext } from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import { Typography } from '@material-ui/core';

import { ServiceContext, Services } from 'services/ServiceContainer';
import { GameState } from 'services/GameController';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = () =>
  createStyles({
    root: {},
    message: {
      '&:empty:before': {
        content: "'\\200b'" // unicode zero width space character
      }
    }
  });

export type MessageBoardProps = WithStyles<typeof styles>;

const MessageBoard: React.ComponentType<MessageBoardProps> = ({
  classes
}: MessageBoardProps) => {
  const { gameController } = useContext(ServiceContext) as Services;
  return (
    <div aria-live="assertive" className={classes.root}>
      <Typography variant="h2" component="p" className={classes.message}>
        {/*
         * In order for screen readers to read the whole message when it
         * changes, the whole text needs to be re-rendered. As a result there
         * is a bit of code duplication in the next two conditional blocks
         */}
        {gameController.state === GameState.IN_PROGRESS &&
          gameController.currentPlayer.equals(gameController.playerOne) && (
            <>Player One&apos;s Turn</>
          )}
        {gameController.state === GameState.IN_PROGRESS &&
          gameController.currentPlayer.equals(gameController.playerTwo) && (
            <>Player Two&apos;s Turn</>
          )}
        {gameController.state === GameState.COMPLETED &&
          gameController.winner && (
            <>Player {gameController.winner.displayName()} Wins!</>
          )}
        {gameController.state === GameState.COMPLETED &&
          gameController.winner === null && <>You tied -_-</>}
      </Typography>
    </div>
  );
};

export default withStyles(styles)(observer(MessageBoard));

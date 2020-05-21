import React, { useContext } from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import { Typography } from '@material-ui/core';

import { ServiceContext, Services } from 'services/ServiceContainer';
import Player from 'models/Player';
import { GameState } from 'services/GameController';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = () =>
  createStyles({
    root: {},
    // https://martinwolf.org/before-2018/blog/2015/01/pure-css-savingloading-dots-animation/
    '@keyframes blink': {
      '0%': {
        opacity: '.2'
      },
      '20%': {
        opacity: '1'
      },
      '100%': {
        opacity: '.2'
      }
    },
    dots: {
      '& span': {
        animationName: '$blink',
        animationDuration: '2s',
        animationIterationCount: 'infinite',
        animationFillMode: 'both'
      },
      '& span:nth-child(2)': {
        animationDelay: '.2s'
      },
      '& span:nth-child(3)': {
        animationDelay: '.4s'
      }
    },
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
  const botThinking =
    gameController.currentPlayer.equals(new Player('bot')) &&
    gameController.state === GameState.IN_PROGRESS;
  const userWon =
    gameController.winner && gameController.winner.equals(new Player('human'));
  const userLost =
    gameController.winner && gameController.winner.equals(new Player('bot'));
  const draw =
    gameController.winner === null &&
    gameController.state === GameState.COMPLETED;
  return (
    <div aria-live="assertive" className={classes.root}>
      <Typography variant="h2" component="p" className={classes.message}>
        {botThinking && (
          <>
            Bot is thinking
            <span className={classes.dots}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </>
        )}
        {userWon && 'You Win!'}
        {userLost && 'You lose :('}
        {draw && 'You tied -_-'}
      </Typography>
    </div>
  );
};

export default withStyles(styles)(observer(MessageBoard));

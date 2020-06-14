import React, { useContext, useEffect } from 'react';
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import ConfettiGenerator from 'confetti-js';

import { ServiceContext, Services } from 'services/ServiceContainer';
import { GameState } from 'services/GameController';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ zIndex }: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      zIndex: zIndex.tooltip,
      pointerEvents: 'none',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  });

export type ConfettiProps = WithStyles<typeof styles>;

interface ConfettiAnimationProps {
  className?: string;
}

const ConfettiAnimation: React.ComponentType<ConfettiAnimationProps> = ({
  className
}: ConfettiAnimationProps) => {
  const canvasId = 'confetti-canvas';
  useEffect(() => {
    const confettiSettings = {
      target: canvasId,
      max: 2000,
      respawn: false,
      props: ['triangle'],
      width: document.body.scrollWidth,
      height: document.body.scrollHeight
    };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
  });

  return <canvas id={canvasId} className={className} />;
};

const Confetti: React.ComponentType<ConfettiProps> = ({
  classes
}: ConfettiProps) => {
  const services = useContext(ServiceContext) as Services;
  if (services.gameController.state === GameState.COMPLETED) {
    return <ConfettiAnimation className={classes.root} />;
  }
  return null;
};

export default withStyles(styles)(observer(Confetti));

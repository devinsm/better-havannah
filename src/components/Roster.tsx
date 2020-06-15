import React, { useContext } from 'react';
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import { Card, CardContent, Typography } from '@material-ui/core';
import clsx from 'clsx';

import { ServiceContext, Services } from 'services/ServiceContainer';
import Stone from './Stone';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
    root: {},
    content: {
      paddingLeft: '1.25rem',
      paddingRight: '2rem'
    },
    header: {
      marginBottom: spacing(2)
    },
    playerList: {
      display: 'inline-block',
      listStyle: 'none',
      margin: 0,
      padding: 0
    },
    playerListItem: {
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      marginBottom: spacing(1)
    },
    stoneSvg: {
      display: 'inline',
      height: '2.5rem',
      marginRight: spacing(1)
    }
  });

export interface RosterProps extends WithStyles<typeof styles> {
  className?: string;
}

const Roster: React.ComponentType<RosterProps> = ({
  classes,
  className
}: RosterProps) => {
  const { gameController } = useContext(ServiceContext) as Services;
  const players = [gameController.playerOne, gameController.playerTwo];
  return (
    <Card aria-hidden="true" className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <Typography variant="h3" component="h2" className={classes.header}>
          Players
        </Typography>
        <ul className={classes.playerList}>
          {players.map(player => (
            <li key={player.id} className={classes.playerListItem}>
              <svg viewBox="0 0 100 100" className={classes.stoneSvg}>
                <Stone
                  player={player}
                  center={{ x: 50, y: 50 }}
                  radius={48}
                  borderWidth={1}
                />
              </svg>
              <Typography variant="h3" component="span">
                {player.displayName()}
              </Typography>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default withStyles(styles)(observer(Roster));

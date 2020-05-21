import React from 'react';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  Grid,
  Box
} from '@material-ui/core';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    details: {
      fontSize: theme.typography.subtitle1.fontSize
    },
    shortcutList: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    },
    shortcutListItem: {
      marginBottom: '0.5rem'
    },
    shortcutKey: {
      background: 'rgb(242, 242, 242)',
      display: 'inline-block',
      fontFamily: "'Roboto Mono', monospace",
      marginRight: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1)
    }
  });
export type InformationPanelsProps = WithStyles<typeof styles>;

const SHORTCUTS: { key: string; actionDescription: string }[] = [
  {
    key: 'W',
    actionDescription: 'Move up'
  },
  {
    key: 'Q',
    actionDescription: 'Move diagonally up and to the left'
  },
  {
    key: 'E',
    actionDescription: 'Move diagonally up and to the right'
  },
  {
    key: 'S',
    actionDescription: 'Move down'
  },
  {
    key: 'A',
    actionDescription: 'Move diagonally down and to the left'
  },
  {
    key: 'D',
    actionDescription: 'Move diagonally down and to the right'
  }
];

const InformationPanels: React.ComponentType<InformationPanelsProps> = ({
  classes
}: InformationPanelsProps) => {
  return (
    <div className={classes.root}>
      <ExpansionPanel aria-controls="rules-content" id="rules-header">
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h2">Rules</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{ root: classes.details }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Box component="p" mt={0}>
                Havannah is a bit like Connect Four on steroids. It&apos;s a two
                player game where players alternate placing stones on a
                hexagonal board. The board itself is made up of hexagonal cells,
                and each cell can have at most one stone. Once placed, stones
                are never moved.
              </Box>
              <p>
                A player wins by making one of three shapes with their stones: a
                fork, a bridge, or a ring. A fork is a group of stones which
                connect three sides of the board. A bridge is a group of stones
                which connect two corners of the board. A ring is a group of
                stones which form a loop around one or more cells (whether or
                not the enclosed cells have stones).
              </p>
            </Grid>
            <Grid item xs={12} md={3}>
              <Grid item>
                <p>image of fork, bridge, and loop goes here</p>
              </Grid>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        aria-controls="keyboard-nav-content"
        id="keyboard-nav-header"
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h2">Keyboard Shortcuts</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{ root: classes.details }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Box component="p" mt={0}>
                The following shortcuts can be used to navigate the board:
              </Box>
              <ul className={classes.shortcutList}>
                {SHORTCUTS.map(shortCut => (
                  <li key={shortCut.key} className={classes.shortcutListItem}>
                    <span className={classes.shortcutKey}>{shortCut.key}</span>
                    <span>{shortCut.actionDescription}</span>
                  </li>
                ))}
              </ul>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default withStyles(styles)(InformationPanels);

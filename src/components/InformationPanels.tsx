import React from 'react';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography
} from '@material-ui/core';
import { withStyles, createStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export interface InformationPanelsProps {
  classes: {
    root: string;
  };
}

const InformationPanels: React.ComponentType<InformationPanelsProps> = ({
  classes
}: InformationPanelsProps) => {
  return (
    <div className={classes.root}>
      <ExpansionPanel aria-controls="rules-content" id="rules-header">
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" component="h2">
            Rules
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>rules go here...</ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        aria-controls="keyboard-nav-content"
        id="keyboard-nav-header"
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" component="h2">
            Keyboard Shortcuts
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>keyboard goes here...</ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default withStyles(theme =>
  createStyles({
    root: {
      width: '100%',
      marginBottom: theme.spacing(6),
      marginTop: theme.spacing(4)
    }
  })
)(InformationPanels);

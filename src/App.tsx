import React from 'react';
import Board from 'components/Board';
import { makeStyles, createStyles } from '@material-ui/core/styles';

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
      maxWidth: '1100px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  })
);
const App: React.ComponentType = () => {
  const styleClasses = useAppStyles();
  return (
    <div className={styleClasses.root}>
      <div className={styleClasses.content}>
        <h1>Havannah</h1>
        <Board widthPx={1100} />
      </div>
    </div>
  );
};

export default App;

export const layoutStyles = theme => ({
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto'
    },
    contentBackground: {
        background: "#ecf0f1"
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
});
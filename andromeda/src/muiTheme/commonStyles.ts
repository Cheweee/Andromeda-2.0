import { Theme } from "@material-ui/core";
import { green, amber } from '@material-ui/core/colors';

export const commonStyles = (theme: Theme) => ({
  td: {
    paddingTop: '4px',
    paddingBottom: '4px'
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  whiteBackground: {
    background: '#fff'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  fixedHeight240: {
    height: 240
  },
  fixedHeight300: {
    height: 300
  },
  margin0: {
    margin: 0
  },
  padding0: {
    padding: 0
  },
  padding1: {
    padding: ".5em"
  },
  padding1X: {
    paddingLeft: ".5em",
    paddingRight: ".5em"
  },
  padding1Y: {
    paddingTop: ".5em",
    paddingBottom: ".5em"
  },
  padding1Left: {
    paddingLeft: ".5em"
  },
  padding1Right: {
    paddingRight: ".5em"
  },
  padding1Top: {
    paddingTop: ".5em"
  },
  padding1Bottom: {
    paddingBottom: ".5em"
  },
  padding2: {
    padding: "1em"
  },
  padding2X: {
    paddingLeft: "1em",
    paddingRight: "1em"
  },
  padding2Y: {
    paddingTop: "1em",
    paddingBottom: "1em"
  },
  padding2Left: {
    paddingLeft: "1em"
  },
  padding2Right: {
    paddingRight: "1em"
  },
  padding2Top: {
    paddingTop: "1em"
  },
  padding2Bottom: {
    paddingBottom: "1em"
  },
  margin1Top: {
    marginTop: ".5em"
  },
  margin1X: {
    marginLeft: ".5em",
    marginRight: ".5em"
  },
  margin1Left: {
    marginLeft: ".5em"
  },
  margin1Right: {
    marginRight: ".5em"
  },
  margin1Y: {
    marginTop: ".5em",
    marginBottom: ".5em"
  },
  margin2Top: {
    marginTop: "1em"
  },
  margin1: {
    margin: ".5em"
  },
  margin2: {
    margin: "1em"
  },
  w100: {
    width: "100%"
  },
  h100: {
    height: "100%"
  },
  footer: {
    position: "sticky",
    bottom: 0,
    right: 0,
    left: 0,
    marginTop: "10px"
  },
  notUnderlined: {
    '&:before': {
      height: 0
    }
  },
  searchIcon: {
    color: "rgba(0, 0, 0, 0.54)"
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },  
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  overflowContainer: {
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 400,
  },
  fitContent: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
});
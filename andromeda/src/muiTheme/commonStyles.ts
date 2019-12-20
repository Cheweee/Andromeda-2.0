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
    padding: "1em"
  },
  padding2: {
    padding: "2em"
  },
  margin1Top: {
    marginTop: "12px"
  },
  margin1X: {
    marginLeft: "0.5em",
    marginRight: "0.5em"
  },
  margin1Left: {
    marginLeft: "0.5em"
  },
  margin1Right: {
    marginRight: "0.5em"
  },
  margin1Y: {
    marginTop: "0.5em",
    marginBottom: "0.5em"
  },
  margin2Top: {
    marginTop: "24px"
  },
  margin1: {
    margin: "12px"
  },
  margin2: {
    margin: "24px"
  },
  w100: {
    width: "100%"
  },
  footer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    paddingLeft: "112px",
    paddingRight: "36px"
  },
  footerContainer: {
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
    background: "#fff",
    boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
  },
  footerSpacer: {
    height: "100px"
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
import { Theme } from "@material-ui/core";

export const expansionPanelStyles = (theme: Theme) => ({
    panelRoot: {
        border: 'none',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    panelExpanded: {},
    summaryRoot: {
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    summaryContent: {},
    summaryExpanded: {},
    detailsRoot: {
      padding: 0,
    }
})
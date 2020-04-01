import { Theme } from '@material-ui/core';

export const chartStyles = (theme: Theme) => {
    const bar = {
        fill: theme.palette.primary.light
    };

    return {
        bar,
    }
}
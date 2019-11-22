import * as React from "react";
import { BarChart, XAxis, Bar, ResponsiveContainer, Tooltip as ChartTooltip, TooltipProps } from "recharts";
import { DistributionExtendedTooltipPayload, DistributionBarChartData } from "../models/Dash";
import { Card, CardContent, Typography, Grid, WithStyles, withStyles } from "@material-ui/core";
import { mergeStyles } from "../utilities";
import { chartStyles, commonStyles } from "../muiTheme";

const styles = mergeStyles(chartStyles, commonStyles);

interface IDistributionChartTooltipProps extends TooltipProps {
    classes: Props['classes']
}

const DistributionChartTooltip = (props: IDistributionChartTooltipProps) => {
    const { classes, payload, active } = props;

    if (active && payload.length > 0) {
        const extendedPayload = (payload[0] as DistributionExtendedTooltipPayload).payload;
        const lecturer = extendedPayload.lecturer;
        const lections = extendedPayload.lections;
        const laboratories = extendedPayload.laboratories;
        const practicals = extendedPayload.practicals;
        const summary = extendedPayload.summary;

        return (
            <Card>
                <CardContent>
                    <Typography variant="subtitle1" color="primary" gutterBottom>{lecturer}</Typography>
                    <Grid container direction="column">
                        {lections && <Typography variant="caption" className={classes.lections}>Часов лекционных занятий: {lections}</Typography>}
                        {laboratories && <Typography variant="caption" className={classes.laboratories}>Часов лабораторных занятий: {laboratories}</Typography>}
                        {practicals && <Typography variant="caption" className={classes.practicals}>Часов практических занятий: {practicals}</Typography>}
                        {!summary && <Typography variant="caption">Нагрузка еще не распределена</Typography>}
                    </Grid>
                </CardContent>
            </Card>
        );
    }

    return null;
}

interface Props extends WithStyles<typeof styles> {
    chartData: DistributionBarChartData[];
}

export default withStyles(styles)(function StudyLoadChart(props: Props) {
    return (
        <ResponsiveContainer width="100%" minWidth={600} height={200}>
            <BarChart
                data={props.chartData}
            >
                <ChartTooltip
                    isAnimationActive={false}
                    cursor={false}
                    content={<DistributionChartTooltip classes={props.classes} />}
                />
                <Bar dataKey="summary" stackId="a" className={props.classes.bar} />
            </BarChart>
        </ResponsiveContainer>
    );
});
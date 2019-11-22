import * as React from "react";
import { DistributionBarChartData } from "../models/Dash";
import { withStyles, WithStyles } from "@material-ui/styles";
import { mergeStyles } from "../utilities";
import { commonStyles } from "../muiTheme";
import { Grid, Card, CardHeader, Tooltip, IconButton, CardContent } from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";

const styles = mergeStyles(commonStyles);

export interface Props extends WithStyles<typeof styles> {
    lecturer: DistributionBarChartData;
    onDelete: (id: number) => void;
}

export default withStyles(styles)(function LecturerStudyLoad (props: Props) {
    const { lecturer } = props;

    return (
        <Card>
            <CardHeader
                title={lecturer.lecturer}
                action={
                    <Grid>
                        <Tooltip title="Редактировать нагрузку">
                            <IconButton>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить нагрузку">
                            <IconButton onClick={() => { props.onDelete(lecturer.id) }}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                }
            />
            <CardContent>

            </CardContent>
        </Card>
    );
});
import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/styles";
import { Grid, Card, CardHeader, Tooltip, IconButton, CardContent } from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import { mergeStyles, getShortening } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { DistributionData } from "../../../models";
const styles = mergeStyles(commonStyles);

export interface Props extends WithStyles<typeof styles> {
    data: DistributionData;
    onDelete: (id: number) => void;
}

export const StudyLoadCard = withStyles(styles)(function (props: Props) {
    const { data } = props;

    const lecturer = data.lecturer;
    const lecturerName = lecturer && (lecturer.secondname + ' ' + getShortening(lecturer.firstname) + '.' + (lecturer.secondname && (getShortening(lecturer.secondname) + '.')));

    return (
        <Card>
            <CardHeader
                title={lecturerName}
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
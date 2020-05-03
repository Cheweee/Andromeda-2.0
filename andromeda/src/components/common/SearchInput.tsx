import * as React from "react";

import { InputBase } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    value: string;
    onValueChange: (value: string) => void;
}

export const Input = withStyles(styles)(function (props: Props) {
    function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
        const { onValueChange: onSearchChange } = props;
        const value = event.target.value;
        onSearchChange(value);
    }

    const {
        value,
        classes
    } = props;
    return (
        <InputBase
            id="search-field"
            className={classes.notUnderlined}
            value={value}
            onChange={handleSearch}
            placeholder="Поиск"
            margin="none"
        />
    );
});
import * as React from "react";

import { InputBase } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    search: string;
    onSearchChange: (search: string) => void;
}

export const SearchInput = withStyles(styles)(function (props: Props) {
    function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
        const { onSearchChange } = props;
        const search = event.target.value;
        onSearchChange(search);
    }

    const {
        search,
        classes
    } = props;
    return (
        <InputBase
            id="search-field"
            className={classes.notUnderlined}
            value={search}
            onChange={handleSearch}
            placeholder="Поиск"
            margin="none"
        />
    );
});
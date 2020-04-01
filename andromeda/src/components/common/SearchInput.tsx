import * as React from "react";
import { useState } from "react";

import { InputBase } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { IFilter } from "../../models/commonModels";

const styles = mergeStyles(commonStyles);

interface Props extends IFilter, WithStyles<typeof styles> {
    onSearchChange: (newValue: string) => void;
    onSearch?: () => void;
}

export const SearchInput = withStyles(styles)(function (props: Props) {
    const [timerId, setTimerId] = useState<NodeJS.Timeout>(null);

    function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
        const {
            debounce,
            onSearch,
            onSearchChange
        } = props;

        const search = event.target.value;
        onSearchChange(search);

        if (!timerId && onSearch) {
            let newTimerId = setTimeout(() => {
                onSearch();
                clearTimeout(timerId);
                setTimerId(timerId);
            }, debounce);
            setTimerId(newTimerId);
        }
    }

    const {
        classes,
        search
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
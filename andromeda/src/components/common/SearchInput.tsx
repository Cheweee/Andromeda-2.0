import * as React from "react";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { Search } from "@material-ui/icons";
import { InputBase, Grid } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/styles";
import { Filter } from "../../models/commonModels";

const styles = mergeStyles(commonStyles);

interface Props extends Filter, WithStyles<typeof styles> {
    onSearchChange: (newValue: string) => void;
    onSearch: () => void;
}

interface State {
    timerId: NodeJS.Timeout;
}

class SearchInputBase extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            timerId: null
        }
    }

    private handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            debounce,
            onSearch,
            onSearchChange
        } = this.props;
        const {
            timerId
        } = this.state;
        const search = event.target.value;
        onSearchChange(search);

        if (!timerId) {
            let newTimerId = setTimeout(() => {
                onSearch();
                clearTimeout(timerId);
                this.setState({ timerId })
            }, debounce);
            this.setState({ timerId: newTimerId })
        }
    }

    render() {
        const {
            classes,
            search
        } = this.props;
        return (
            <InputBase
                id="search-field"
                className={classes.notUnderlined}
                value={search}
                onChange={this.handleSearch}
                placeholder="Поиск"
                margin="none"
            />
        );
    }
}
export const SearchInput = withStyles(styles)(SearchInputBase);
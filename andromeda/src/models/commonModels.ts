import { Padding } from "@material-ui/core/TableCell";

export interface Filter {
    debounce?: number;
    search?: string;
}

export interface Column {
    name: string;
    displayName: string;
    padding?: Padding,
    render?: (data: any) => JSX.Element;
}

export interface Validation {
    isValid: boolean;
}

export interface GetOptions {
    id?: number;
    ids?: number[];
    search?: string;
}

export interface SelectableValue {
    selected?: boolean;
    id?: number;
    value: string;
}
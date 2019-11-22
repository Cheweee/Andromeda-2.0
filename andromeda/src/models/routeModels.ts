import { SvgIconProps } from "@material-ui/core/SvgIcon";

export interface Route {
    name: string;
    text?: string;
    path: string;
    icon?: (props: SvgIconProps) => JSX.Element;
    exact?: boolean;
    component?: React.ComponentType;
}
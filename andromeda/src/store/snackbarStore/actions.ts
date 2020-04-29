import { Action } from "redux";
import { SnackbarVariant } from "../../models";

export enum ActionType {
    show = 'SHOW',
    hide = 'HIDE'
}

export interface ShowAction extends Action<ActionType> {
    type: ActionType.show;
    variant: SnackbarVariant;
    message: string;
}
export interface HideAction extends Action<ActionType> {
    type: ActionType.hide;
}

export type SnackbarActions = ShowAction | HideAction;

function showSnackbar(message: string, variant: SnackbarVariant = SnackbarVariant.info): SnackbarActions {
    console.log(`${variant.toString().toUpperCase()}: ${message}`);
    return { type: ActionType.show, message: message, variant: variant };
}
function hideSnackbar(): SnackbarActions {
    return { type: ActionType.hide };
}

export default {
    showSnackbar,
    hideSnackbar,
}
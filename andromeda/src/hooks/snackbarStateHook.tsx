import { useState } from "react";
import { SnackbarState, SnackbarVariant } from "../models/commonModels";

export function useSnackbarState() : [SnackbarState, (message: string, open: boolean, newVariant: SnackbarVariant) => void] {
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [variant, setVariant] = useState<SnackbarVariant>(undefined);

    function setState(newMessage: string = '', newOpen: boolean, newVariant: SnackbarVariant = undefined) {
        setOpen(newOpen);
        setVariant(newVariant);
        setMessage(newMessage);
    }

    const state: SnackbarState = { open, message, variant };
    return [ state, setState ];
}
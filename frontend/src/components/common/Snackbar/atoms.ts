import Recoil, { atom, useSetRecoilState } from 'recoil';

type SnackbarType = "error" | "warning" | "information" | "check";

export type SnackbarState = {
    message: string;
    type: SnackbarType;
} | null;

export const snackBarState = atom<SnackbarState>({
    key: 'snackbarState',
    default: null,
});

export const clearSnackbar = (setter: Recoil.SetterOrUpdater<SnackbarState>) => setter(null);

export const useSnackbar = () => {
    const setSnackbar = useSetRecoilState(snackBarState);
    return (type: SnackbarType | "clear", message?: string) => {
        if (type === "clear") {
            setSnackbar(null);
        } else {
            setSnackbar({
                message: message || '',
                type: type,
            })
        }
    }
}

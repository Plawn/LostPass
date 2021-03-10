import React, { memo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { IconButton } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { useSnackbar } from '../Snackbar/atoms';

const CopyButton = ({ string }: { string: string }) => {
    const snackbar = useSnackbar();
    const onCopy = (s: string, result: boolean) => {
        if (result) {
            snackbar("check", "Lien copié avec succès");
        } else {
            snackbar("error", "Echec de la copie");
        }
    };
    return (
        <CopyToClipboard onCopy={onCopy} text={string}>
            <IconButton component="span">
                <FileCopyOutlinedIcon />
            </IconButton>
        </CopyToClipboard>
    );
}
export default memo(CopyButton);
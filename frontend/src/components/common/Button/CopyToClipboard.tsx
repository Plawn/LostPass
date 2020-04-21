import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { IconButton } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

export default ({ string }: { string: string }) => (
    <CopyToClipboard text={string}>
        <IconButton component="span">
            <FileCopyOutlinedIcon />
        </IconButton>
    </CopyToClipboard>
);
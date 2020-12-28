import React, { memo } from 'react';
import BaseCopyToClipboard from 'react-copy-to-clipboard';
import { IconButton } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

const CopyToClipboard = memo(({ string }: { string: string }) => (
    <BaseCopyToClipboard text={string}>
        <IconButton component="span">
            <FileCopyOutlinedIcon />
        </IconButton>
    </BaseCopyToClipboard>
));

export default CopyToClipboard;
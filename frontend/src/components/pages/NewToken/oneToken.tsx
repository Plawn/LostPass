import React from 'react';
import TextField from '../../common/form/TextField/TextField';
import CopyToClipboard from '../../common/Button/CopyToClipboard';

export default ({ url }: { url: string }) => (
    <div style={{ display: 'flex' }}>
        <TextField value={url}
            style={{ width: '100%' }}
            InputProps={{ readOnly: true }}
        />
        <CopyToClipboard string={url} />
    </div>
)
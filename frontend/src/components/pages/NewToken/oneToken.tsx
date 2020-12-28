import React, { memo } from 'react';
import TextField from '../../common/form/TextField/TextField';
import CopyToClipboard from '../../common/Button/CopyToClipboard';

const OneToken = memo(({ url }: { url: string }) => (
    <div style={{ display: 'flex' }}>
        <TextField value={url}
            style={{ width: '100%' }}
            InputProps={{ readOnly: true }}
        />
        <CopyToClipboard string={url} />
    </div>
));

export default OneToken;
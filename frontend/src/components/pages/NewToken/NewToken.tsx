import React, { useState, useMemo, memo } from 'react';
import { Typography } from '@material-ui/core';
import { LoadingComponent } from '../../common/LoadingComponent/LoadingComponent';
import Button from '../../common/Button/Button';
import CopyToClipboard from '../../common/Button/CopyToClipboard';
import OneToken from './oneToken';
import TokenForm from './tokenForm';

const makeViewLink = (token: string) => document.location.origin + `/view/${encodeURI(token)}`;



const CopyAllLinks = memo(({ urls }: { urls: string[] }) => (
    <div >
        <Typography style={{ display: 'inline' }}>
            Copy all
        </Typography>
        <CopyToClipboard string={urls.join("\n")} />
    </div>
));



const NewToken = () => {


    const [tokens, setTokens] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // doing so to add all copy on one click after
    const urls = useMemo(() => tokens.map(makeViewLink), [tokens]);

    return (
        <LoadingComponent loading={loading}>
            {tokens.length > 0 ?
                <>
                    {urls.map(url => <OneToken url={url} />)}
                    <br />
                    <CopyAllLinks urls={urls} />
                    <br />
                    <Button onClick={() => setTokens([])}>
                        Share again
                    </Button>
                </>
                :
                <TokenForm setLoading={setLoading} setTokens={setTokens} />
            }
        </LoadingComponent>
    )
}

export default NewToken;
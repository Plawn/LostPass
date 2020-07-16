import React, { useState, memo } from 'react';
import { LoadingComponent } from '../../common/LoadingComponent/LoadingComponent';
import Bold from '../../common/Text/Bold';
import { Button, Typography } from '@material-ui/core';
import MultiLineTextField from '../../common/form/MultiLineTextField/MultiLineTextField';
import { retrieveContent } from '../../../api/api';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';

const ValidToken = memo(({ token }: { token: string }) => {
    const [content, setContent] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const handleGetContent = () => {
        setLoading(true);
        retrieveContent(token)
            .then(setContent)
            .catch(() => setContent('Failed to fetch content'))
            .finally(() => setLoading(false));
    }

    return (
        <LoadingComponent loading={loading}>
            {
                content !== undefined ?
                    <>
                        <Typography variant="h3" >
                            Content
                        </Typography>
                        <MultiLineTextField value={content} placeholder="Empty" InputProps={{ readOnly: true }} />
                    </>
                    :
                    <>
                        <Typography variant="h1" >
                            Valid {" "}
                            <CheckCircleOutlinedIcon htmlColor="green" style={{ height: '95%', width: '13%' }} />
                        </Typography>
                        <br />
                        Do you want to see the content ?
                        <br />
                        <br />
                        You can only see it <Bold>once !</Bold>
                        <br />
                        <br />
                        <Button onClick={handleGetContent}>
                            See Content
                        </Button>
                    </>
            }
        </LoadingComponent>
    )
});

export default ValidToken;
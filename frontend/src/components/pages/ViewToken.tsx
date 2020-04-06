import React, { useState, useEffect, ReactNode } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { LoadingComponent } from '../common/LoadingComponent/LoadingComponent';
import { Typography, IconButton } from '@material-ui/core';
import MultiLineTextField from '../common/form/MultiLineTextField/MultiLineTextField';
import { retrieveContent, verifyToken } from '../../api/api';
import Button from '../common/Button/Button';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

type RouteParams = {
    token: string;
}

type Props = RouteComponentProps<RouteParams>

const Bold: React.FC<{}> = ({ children }: { children?: ReactNode }) => <span style={{ fontWeight: 'bold' }}>{children}</span>;

const InvalidToken = () => {
    return (
        <Typography variant="h1" >
            Invalid {" "}
            <NotInterestedIcon htmlColor="red" style={{ height: '95%', width: '13%' }} />
        </Typography>
    );
}

const ValidToken = ({ token }: { token: string }) => {
    const [value, setValue] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const handleGetContent = async () => {
        setLoading(true);
        try {
            const content = await retrieveContent(token);
            setValue(content);
        } catch (e) {

        }
        setLoading(false);
    }

    return (

        <LoadingComponent loading={loading}>
            {
                value !== undefined ?
                    <>
                        <Typography variant="h3" >
                            Content
                        </Typography>
                        <MultiLineTextField value={value} placeholder="Empty" InputProps={{ readOnly: true }} />
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
}

const ViewToken = (props: Props) => {
    const token = props.match.params.token;
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const isValid = await verifyToken(token);
            setValid(isValid);
        } catch (e) {

        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <LoadingComponent loading={loading}>
            {valid ? <ValidToken token={token} /> : <InvalidToken />}
        </LoadingComponent>
    )
}

export default ViewToken;
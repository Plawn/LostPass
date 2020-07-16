import React, { useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { LoadingComponent } from '../../common/LoadingComponent/LoadingComponent';
import { verifyToken } from '../../../api/api';
import InvalidToken from './invalidToken';
import ValidToken from './validToken';

type RouteParams = {
    token: string;
}

type Props = RouteComponentProps<RouteParams>;

const TokenViewer = ({ valid, token }: { valid?: boolean; token: string }) => (valid ? <ValidToken token={token} /> : <InvalidToken />)

const ViewToken = (props: Props) => {
    const token = props.match.params.token;
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState<boolean | undefined>(undefined);

    const loadData = useCallback(() => {
        setLoading(true);
        verifyToken(token)
            .then(isValid => setValid(isValid))
            .catch(() => setValid(false))
            .finally(() => setLoading(false));
    }, [token]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <LoadingComponent loading={loading || valid === undefined}>
            <TokenViewer valid={valid} token={token} />
        </LoadingComponent>
    );
}

export default ViewToken;
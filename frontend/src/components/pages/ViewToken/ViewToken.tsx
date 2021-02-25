import React, { useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { LoadingComponent } from '../../common/LoadingComponent/LoadingComponent';
import { verifyToken, VerifyTokenDto } from '../../../api/api';
import InvalidToken from './invalidToken';
import ValidToken from './validToken';

type RouteParams = {
    token: string;
}

type Props = RouteComponentProps<RouteParams>;

const TokenViewer = ({ data, token }: { data?: VerifyTokenDto; token: string }) => {
    return (data?.valid ? <ValidToken meta={data.meta} token={token} /> : <InvalidToken />)
}



const ViewToken = (props: Props) => {
    const token = props.match.params.token;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<VerifyTokenDto>();

    const loadData = useCallback(() => {
        setLoading(true);
        verifyToken(token)
            .then(setData)
            .catch(() => setData({ valid: false, meta: { type: 0 } }))
            .finally(() => setLoading(false));
    }, [token]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <LoadingComponent loading={loading || data === undefined}>
            <TokenViewer data={data} token={token} />
        </LoadingComponent>
    );
}

export default ViewToken;
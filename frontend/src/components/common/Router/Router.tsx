import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import NewToken from '../../pages/NewToken/NewToken';
import ViewToken from '../../pages/ViewToken/ViewToken';
import CenteredCard from '../PageContainer/CenteredCard';


const MyRouter = () => {
    return (
        <CenteredCard>
            <BrowserRouter>
                <Switch>
                    <Route path="/view/:token" component={ViewToken} />
                    <Route path="/" component={NewToken} />
                </Switch>
            </BrowserRouter>
        </CenteredCard>
    )
}


export default MyRouter;
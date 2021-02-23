import { createMuiTheme, CssBaseline, makeStyles, Paper, Theme, ThemeProvider, Typography } from '@material-ui/core';
import React from 'react';
import DarkModeToggle from "react-dark-mode-toggle";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useSettings } from '../../../utils/utils';
import NewToken from '../../pages/NewToken/NewToken';
import ViewToken from '../../pages/ViewToken/ViewToken';
import CenteredCard from '../PageContainer/CenteredCard';

const makeTheme = (dark: boolean) => createMuiTheme({
    palette: {
        type: dark ? 'dark' : 'light',
    },
    overrides: {
        MuiPaper: {
            root: {
                transition: "background-color 0.5s linear, color 0.5s linear, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            },
        },
    }
});

const useStyles = makeStyles((theme: Theme) => ({
    divTitle: {
        textAlign: 'center',
        height: '10vh'
    },
    // TODO: to fix not working as intented
    content: {
        // backgroundColor: theme.palette.background.paper,
        // transition: "background-color 0.5s linear, color 1s linear, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    }
}));

const MyRouter = () => {
    const { settings, setSettings } = useSettings();
    const theme = makeTheme(settings.dark);
    const classes = useStyles();
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Paper className={classes.content}>
                <div className={classes.divTitle}>
                    <Typography variant="h1">
                        LostPass
                    </Typography>
                    <DarkModeToggle onChange={e => setSettings({ dark: e })} checked={settings.dark} />
                </div>
                <CenteredCard>
                    <BrowserRouter>
                        <Switch>
                            <Route path="/view/:token" component={ViewToken} />
                            <Route path="/" component={NewToken} />
                        </Switch>
                    </BrowserRouter>
                </CenteredCard>
            </Paper>
        </ThemeProvider>
    )
}


export default MyRouter;
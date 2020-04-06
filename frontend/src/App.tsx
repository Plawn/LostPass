import React from 'react';
import MyRouter from './components/common/Router/Router';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Particles from "react-particles-js";
import { CssBaseline } from '@material-ui/core';

const theme = createMuiTheme();

export default () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <MyRouter />
  </ThemeProvider>
);

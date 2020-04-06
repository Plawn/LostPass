import React, { ReactNode } from 'react';
import { Grid, Paper } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

type Props = {
    children: ReactNode;
    style?: CSSProperties
}

const CenteredCard: React.FC<Props> = ({ children, style }: Props) => (
    <Grid container justify="center" alignItems="center" style={{ height: '100vh' }}>
        <Paper style={{ textAlign: 'center', padding: '2%', minWidth: '30vw',margin:'1%',  ...style }}>
            {children}
        </Paper>
    </Grid>
);


export default CenteredCard;
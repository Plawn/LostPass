import React, { CSSProperties, ReactNode } from 'react';
import { Grid, Paper } from '@material-ui/core';


type Props = {
    children: ReactNode;
    style?: CSSProperties;
}

const CenteredCard: React.FC<Props> = ({ children, style }: Props) => (
    <Grid container justify="center" alignItems="center" style={{ height: '100vh' }}>
        <Paper style={{ textAlign: 'center', padding: '2%', minWidth: '30vw',margin:'1%',  ...style }}>
            {children}
        </Paper>
    </Grid>
);


export default CenteredCard;
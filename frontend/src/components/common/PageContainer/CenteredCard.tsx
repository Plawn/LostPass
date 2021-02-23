import { Grid, makeStyles, Paper } from '@material-ui/core';
import React, { ReactNode } from 'react';


type Props = {
    children: ReactNode;
}

const useStyle = makeStyles(() => ({
    grid: {
        textAlign: 'center',
        padding: '2%',
        minWidth: '30vw',
        margin: '1%',
    }
}));

const CenteredCard: React.FC<Props> = ({ children }: Props) => {
    const classes = useStyle();
    return (
        <Grid container justify="center" alignItems="center" style={{ height: '90vh' }}>
            <Paper elevation={4} className={classes.grid}>
                {children}
            </Paper>
        </Grid>
    );
}

export default CenteredCard;
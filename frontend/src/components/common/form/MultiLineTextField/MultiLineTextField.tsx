import React from 'react';
import { makeStyles, TextField, TextFieldProps } from '@material-ui/core';

const useStyles = makeStyles({
    multiLineField: {
        width: "100%",
        margin: "1rem 0",
        background: "none",
    },
});

type Props = TextFieldProps;

const MultiLineTextField = (props: Props) => {
    const classes = useStyles();
    return (
        <TextField
            {...props}
            className={classes.multiLineField}
            multiline
            rowsMax={10}
            rows={10}
            variant="outlined"
        />
    );
}

export default MultiLineTextField;
import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';





export default (props: TextFieldProps) => (
    <TextField
        {...props}
        inputProps={{ style: { textAlign: 'center', ...props.style } }}
        variant="outlined"
        margin="dense"
    />
)


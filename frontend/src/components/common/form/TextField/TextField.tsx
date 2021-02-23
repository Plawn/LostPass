import { TextField, TextFieldProps } from '@material-ui/core';
import React from 'react';


const LostTextField = (props: TextFieldProps) => (
    <TextField
        {...props}
        inputProps={{ style: { textAlign: 'center', ...props.style } }}
        variant="outlined"
        margin="dense"
    />
)

export default LostTextField;
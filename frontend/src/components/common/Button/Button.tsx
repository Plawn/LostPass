import React, { memo } from 'react';
import { Button, ButtonProps } from '@material-ui/core';


export default memo((props: ButtonProps) => <Button {...props} variant="outlined" />);

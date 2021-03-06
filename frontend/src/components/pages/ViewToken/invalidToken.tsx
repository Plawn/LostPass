import React, { memo } from 'react';
import { Typography } from '@material-ui/core';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

export default memo(() => (
    <Typography variant="h1" >
        Invalid {" "}
        <NotInterestedIcon htmlColor="red" style={{ height: '95%', width: '13%' }} />
    </Typography>
));

#!/bin/bash
python3 start.py 5000 &
nginx -g "daemon off;" &

# patch to get CRTL-C working
PID=`jobs -p`
trap "kill -SIGQUIT $PID" INT
wait
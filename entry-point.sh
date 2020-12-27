#!/bin/bash
redis-server --daemonize yes
nginx -g "daemon off;" &
gunicorn -w 4 -k uvicorn.workers.UvicornWorker -D -b 'localhost:5000' app.api:app 
echo "Started LostPass"
# patch to get CRTL-C working
PID=`jobs -p`
trap "kill -SIGQUIT $PID" INT
wait
# build environment
FROM node:14.15.3-alpine3.10 as builder

WORKDIR /app

COPY frontend/package.json frontend/yarn.lock ./

RUN yarn install --ignore-optional --frozen-lockfile 

COPY ./frontend/ .
RUN yarn build

# production environment
FROM python:3.8.6-slim

WORKDIR /api

RUN apt update 
RUN apt install nginx redis -y 

# clean apt cache
RUN rm -rf /var/lib/apt/lists/*
RUN rm -rf /var/cache/apt/archives

RUN pip install gunicorn uvloop httptools

COPY --from=builder app/build/ /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf

COPY backend/requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY ./backend/ .

EXPOSE 4000

COPY entry-point.sh /usr/bin/entry-point.sh

CMD [ "/usr/bin/entry-point.sh" ]
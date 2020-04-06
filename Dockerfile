# build environment
FROM node:alpine as builder

WORKDIR /app

COPY frontend/package.json .

RUN yarn install --ignore-optional --frozen-lockfile 

COPY ./frontend/ .
RUN yarn build

# production environment
FROM python:3.7.2-slim

WORKDIR /api

RUN apt update \
    && apt install nginx -y 

COPY --from=builder app/build/ /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf

COPY backend/requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY ./backend/ .

EXPOSE 4000

COPY entry-point.sh /usr/bin/entry-point.sh

CMD [ "/usr/bin/entry-point.sh" ]
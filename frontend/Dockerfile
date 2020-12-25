FROM node as builder

WORKDIR /app
COPY package.json  ./
COPY yarn.lock ./
RUN yarn install --ignore-optional --frozen-lockfile
COPY . ./
RUN yarn build


FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

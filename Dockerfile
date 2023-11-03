#develop stage
FROM bitnami/node:16 AS pre-build-stage

RUN mkdir -p /opt/app
WORKDIR /opt/app

ARG SCHEMA
ARG BACKEND_IP
ARG BACKEND_PORT

RUN yarn global add @quasar/cli@1.3.2
COPY package*.json ./
COPY yarn.lock ./
RUN yarn config delete https-proxy
RUN yarn config delete proxy
RUN yarn
COPY . .

#build stage
FROM pre-build-stage AS build-stage
RUN quasar build

#production stage
FROM nginx AS production-stage
COPY --from=build-stage /opt/app/dist/spa /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]

#develop stage
FROM pre-build-stage AS develop-stage
EXPOSE 8080
VOLUME /opt/app
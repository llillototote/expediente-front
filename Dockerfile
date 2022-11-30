#develop stage
FROM node:18-alpine AS pre-build-stage

RUN mkdir -p /opt/app
WORKDIR /opt/app

#RUN npm install -g corepack
#RUN corepack enable
#RUN corepack prepare pnpm@latest --activate
#RUN pnpm config set store-dir /usr/local/.pnpm-store
#RUN pnpm setup
RUN yarn global add  @quasar/cli
COPY package*.json ./
RUN yarn
COPY . .

#build stage
FROM pre-build-stage AS build-stage
RUN quasar build

#production stage
FROM nginx AS production-stage
COPY --from=build-stage /opt/app/dist/spa /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]

#develop stage
FROM pre-build-stage AS develop-stage
EXPOSE 9000 4000
VOLUME /opt/app

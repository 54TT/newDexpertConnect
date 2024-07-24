FROM node:18.17.0-alpine as base
WORKDIR /frontend
copy . .
#RUN npm config set registry https://registry.npm.taobao.org
run npm install

from base as build
workdir /frontend
ARG BUILD_ENV=prod
run npm run build:${BUILD_ENV};

FROM nginx:1.19.0 as prod
COPY --from=build /frontend/dist /frontend
ENTRYPOINT ["nginx", "-g", "daemon off;"]

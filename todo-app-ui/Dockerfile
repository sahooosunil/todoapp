FROM node:16 as build
LABEL authors="sunilsahu"
WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY ./src ./src
COPY ./public ./public
RUN npm run build

FROM node:16
WORKDIR /app
COPY --from=build /app/build ./build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
FROM node:14-alpine
RUN apk update
RUN apk add git
RUN git clone https://github.com/Rob--W/cors-anywhere.git
WORKDIR /cors-anywhere
RUN yarn install

CMD ["yarn", "start"]

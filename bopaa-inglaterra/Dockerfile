FROM node:20-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g @nestjs/cli

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
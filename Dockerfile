FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

ENTRYPOINT [ "/app/docker-wait-postgres.sh" ]

EXPOSE 5000

CMD [ "npm", "run", "dev"]
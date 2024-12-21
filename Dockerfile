FROM node:20-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

ENTRYPOINT [ "/app/docker-wait-postgres.sh" ]

EXPOSE 5000

CMD [ "npm", "run", "dev"]
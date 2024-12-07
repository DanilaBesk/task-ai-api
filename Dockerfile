FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate

COPY docker-wait-postgres.sh /app/docker-wait-postgres.sh

ENTRYPOINT [ "/app/docker-wait-postgres.sh" ]

EXPOSE 5000

CMD [ "npm", "run", "dev"]
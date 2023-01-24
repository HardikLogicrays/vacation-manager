
FROM node:14.21.1


WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .


# RUN npm start
FROM node:20
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ENV DOCKER_PORT 8000
EXPOSE $DOCKER_PORT
CMD ["npm", "run", "start:dev"]
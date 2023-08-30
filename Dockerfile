FROM node:20
WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --omit=dev; \
    fi
COPY . .
ENV DOCKER_PORT 8000
EXPOSE $DOCKER_PORT
CMD ["npm", "run", "start:dev"]
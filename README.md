This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run start-dev`

Runs node.js backend in development mode<br />

### `npm run start-react`

Runs the react front end in development mode<br />
Access at http://localhost:3000

### `npm run build`

Builds react application<br />
node.js backend statically serves the react app.

Access at http://localhost:9078<br />

### `Docker`
Currently private <br />
Example docker-compose.yml:<br />

```
version: "3"
services:
  razordash:
    image: razorvlades/razordash:latest
    container_name: razordash
    volumes:
      - ./config:/usr/src/app/config
    ports:
      - 9078:9078
    environment:
      DB_HOST: mongo:27017
      DB_NAME: {db_name}
      DB_USER: {db_user}
      DB_PASS: {db_password}
      SESSION_SECRET: {session_secret}
    restart: always
    depends_on:
      - mongo
  mongo:
    container_name: razordash_db
    image: mongo
    volumes:
      - ./data:/data/db
    ports:
      - 27017:27017
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: {db_user}
      MONGO_INITDB_ROOT_PASSWORD: {db_password}
```

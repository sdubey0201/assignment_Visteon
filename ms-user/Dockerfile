# latest official node image
FROM node:latest
# Create app directory
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# Bundle app source
COPY . .
EXPOSE 3001
CMD [ "node", "index.js" ]
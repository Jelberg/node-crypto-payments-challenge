# Dockerfile

# base image
FROM node:18

# create & set working directory
#RUN mkdir -p /usr/src
WORKDIR /usr/src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# copy source files
COPY . /usr/src

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install
RUN npm install -g ts-node

EXPOSE 3000
  
CMD ["npm", "start"]
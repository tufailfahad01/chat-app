FROM node:latest

# Set working directory to /app 
WORKDIR /app

# Copy package.json to /app
COPY package*.json .

# copy dependencies . . means all files in current directory with node_modules and other files
COPY . .


# run npm install to install dependencies
RUN npm install

EXPOSE 3001 3002

# Start both the application and the proxy server
CMD ["npx", "concurrently", "\"npm run start\"", "\"node proxy.js\""]

# # expose port 3000
# EXPOSE 3001


# # npm run start to run the app
# CMD [ "npm","run","start" ]
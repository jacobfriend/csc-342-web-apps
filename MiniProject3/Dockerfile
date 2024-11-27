# Use the official Node.js image as the base image
FROM node:lts

# Set the working directory in the image
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 80

# Copy the application code to the working directory
COPY . .

# Command to run the app
CMD ["node", "server.js"]
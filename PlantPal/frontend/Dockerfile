# Use a Node.js base image
FROM node:lts

# Create working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose the port Vite will run on
EXPOSE 80

# Start the development server
CMD ["npm", "run", "dev"]

# Use the official Node.js 14.19.3 image as a base image
FROM node:14.19.3 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the required dependencies
RUN npm ci

# Copy the rest of the application code to the container
COPY . .

# Run the build script to create the 'dist' folder
RUN npm run build:prod

# Create a production image using Node.js 14.19.3
FROM node:14.19.3 AS production

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install only the production dependencies
RUN npm ci --only=production

# Copy the 'dist' folder from the build image
COPY --from=build /app/dist /app/dist

# Expose the port that the server will run on
EXPOSE 7000

# Start the server using the 'dist/server.js' file
CMD ["node", "dist/server.js"]

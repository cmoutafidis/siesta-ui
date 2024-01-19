# Use a smaller base image for production
FROM node:14-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy only the package.json and yarn.lock files to optimize caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy the entire project
COPY . .

# Build the React app
RUN yarn build

# Use a lightweight base image for the final production image
FROM nginx:alpine

# Copy the custom Nginx configuration file
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the builder stage to the nginx public directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# The default command to run when the container starts
CMD ["nginx", "-g", "daemon off;"]

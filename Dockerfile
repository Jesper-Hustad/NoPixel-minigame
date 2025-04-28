# Use the official Nginx image as the base image
FROM nginx:latest

# Copy the application files and the nginx.conf file into the container
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Set the entry point to start Nginx
CMD ["nginx", "-g", "daemon off;"]

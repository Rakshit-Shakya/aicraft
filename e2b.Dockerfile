FROM node:21-slim

RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy your actual project
COPY . /home/user

WORKDIR /home/user

# Install YOUR dependencies
RUN npm install

# Make script executable
RUN chmod +x /home/user/compile_page.sh

# You can use most Debian-based base images
# Set the Environment
FROM node:21-slim     

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile_page.sh /compile_page.sh
# Now to make this file executable run the command below-
RUN chmod +x /compile_page.sh

# Install dependencies and customize sandbox
# Change directory to nextjs-app
WORKDIR /home/user/nextjs-app

# "--yes" is added because these files will be running in a docerised container and user will not be able to interact with it, and since we can't interact we have to answer the questions like, "Do you want to continue? (Y/N)" So, we use this to make sure that the terminal doesbn't gets stuck.  
RUN npx --yes create-next-app@15.3.3 . --yes

RUN npx --yes shadcn@2.6.3 init --yes -b neutral --force
RUN npx --yes shadcn@2.6.3 add --all --yes

# Move the Nextjs app to the home directory and remove the nextjs-app directory
RUN mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app

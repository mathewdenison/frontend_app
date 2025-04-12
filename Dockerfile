# Stage 1 - the build process
FROM node:14 as build-stage

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/

# Build the React app
RUN npm run build

# Stage 2 - use Node.js to serve the app directly (without Nginx)
FROM node:14

WORKDIR /app
COPY --from=build-stage /app /app

RUN npm install -g serve

EXPOSE 5000

# Run the app with serve (instead of nginx)
CMD ["serve", "-s", "build", "-l", "5000"]

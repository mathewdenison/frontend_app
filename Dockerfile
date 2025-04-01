# Stage 1 - the build process
FROM node:14 as build-stage

# Accept build-time environment variable
ARG REACT_APP_PUBLIC_BASE_URL

# Make it available to the React build
ENV REACT_APP_PUBLIC_BASE_URL=$REACT_APP_PUBLIC_BASE_URL

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/

# Build the React app (uses REACT_APP_PUBLIC_BASE_URL)
RUN npm run build

# Stage 2 - the production environment
FROM nginx:1.18.0-alpine
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
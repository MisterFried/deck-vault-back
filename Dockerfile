FROM node:21-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["nodemon", "/app/index.js"]
EXPOSE 3000
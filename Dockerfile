FROM node:12-alpine
WORKDIR /app
EXPOSE 5000
COPY . .
RUN npm install
CMD ["node", "index.js"]
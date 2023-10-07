FROM node:18-alpine
WORKDIR /app
EXPOSE 5000
COPY . .
RUN npm install
CMD ["node", "index.js"]
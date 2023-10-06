FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
ENV PORT=5000
EXPOSE 5000
CMD ["node", "index.ts"]
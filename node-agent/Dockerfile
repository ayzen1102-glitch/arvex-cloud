FROM node:18-alpine

WORKDIR /app

# Install LXD client
RUN apk add --no-cache lxd openssh-client

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

ENV NODE_ENV=production
EXPOSE 8085

CMD ["node", "dist/index.js"]

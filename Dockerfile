FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN apk update && \
  apk add build-base libheif vips-dev vips -q
RUN npm install --platform=linuxmusl

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

CMD ["npm", "run", "start:prod"]
FROM node:18-alpine
WORKDIR /opt/taskforce-image
COPY /dist/apps/image/package.json .
RUN npm install --omit=dev
COPY /dist/apps/image .
CMD ["node", "./main.js"]


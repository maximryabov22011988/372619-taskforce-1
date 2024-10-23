FROM node:18-alpine
WORKDIR /opt/taskforce-bff
COPY /dist/apps/bff/package.json .
RUN npm install --omit=dev
COPY /dist/apps/bff .
CMD ["node", "./main.js"]


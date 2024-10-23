FROM node:18-alpine
WORKDIR /opt/taskforce-task
COPY /dist/apps/task/package.json .
RUN npm install --omit=dev
COPY /dist/apps/task .
CMD ["node", "./main.js"]

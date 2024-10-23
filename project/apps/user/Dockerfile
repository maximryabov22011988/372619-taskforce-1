FROM node:18-alpine
WORKDIR /opt/taskforce-users
COPY /dist/apps/user/package.json .
RUN npm install --omit=dev
COPY /dist/apps/user .
CMD ["node", "./main.js"]


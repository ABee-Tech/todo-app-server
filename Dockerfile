FROM node:20
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock*", "npm-shrinkwrap.json*", "./"]
RUN yarn
COPY . .
EXPOSE 5000
RUN chown -R node /usr/src/app
USER node
CMD ["yarn", "start"]

FROM node:18

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

#For Prisma
RUN apt-get update && \
    apt-get install -y libssl1.1 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


RUN npm install


RUN npm install -g typescript


RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "build/index.js"]

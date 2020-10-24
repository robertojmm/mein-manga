FROM node:12 As development

RUN apt-get update && apt-get install -y git libzip-dev unzip wait-for-it

RUN mkdir /opt/mein-manga_data

WORKDIR /opt/mein-manga

COPY package*.json ./

COPY web/package*.json ./web/

RUN npm i && cd web && npm i

COPY . .

EXPOSE 3000

EXPOSE 8080

CMD ["./start.sh"]
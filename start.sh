#!/bin/sh


wait-for-it -h mysql -p 3306 -t 50

cd web && npm run serve &

npm start 



# how to use


## 1)build user MS docker image

docker build . -t user-ms/node_app


## 2) build auth Ms docker image 

docker build . -t auth-ms/node-app


## 3) for mongo db we are using existing docker image from docker hub registory.
we are referring the same images in docker compose file 

## 4) docker-compose up


## 5) login to mongo db container 

docker exec -it <container-name> ./bin/bash
db name for auth: usersAuthdb
use <db-name>
db.usermodels.insert({"userName":"test", "password":"test"}).

## 6) call login end point to create token for the existing user in auht MS
curl --location --request POST 'http://localhost:3000/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userName":"test",    
    "password":"test"
}'
response: 
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRlc3QiLCJpYXQiOjE2Mzc3MzU0NzEsImV4cCI6MTYzNzczNTc3MX0.W-_t7KHo0KtlnB8SNdbMAb04m0Jt4ANt7q936oJblPI"
}

## 7) use this token for Authorization in user MS. 

Please find the postman collections links below.
https://www.getpostman.com/collections/70b062c4ed360c0201a7





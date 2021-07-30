# user-service
This is a compilation of exercises for the `Fundamentals in Backend Development` course. 

Look out for the TODO comments to find where to include your additions to complete the exercise

## Requirements
1. nodejs 16
2. docker & docker-compose
3. heroku-cli

## File structure


## part-5-creating-crud-app

Create a CRUD application. Fill in the missing sections in `src/controllers/user.js` to get the APIs working

## part-5-user-authentication

Add JWT cookie based user authentication. Fill in the implementation in `src/services/authentication.js`.

Two endpoints have been added for you to test your implementation.

1. `POST /users/login` - Takes in an `email` and `password` as JSON in the request body and adds the JWT in your cookies
2. `GET /users/whoami` - Returns the current login user based on the JWT in the cookie'

## part-5-file-upload

Added the `multer` library

## part-6-unit-test

A simple program to write your unit tests against.

## part-6-user-service-unit-tests

Fill in the unit test in the following files:
1. `src/middlewares/authentication.test.js`
2. `src/services/authentication.test.js`
3. `src/services/authentication.test.js`

Run `npm test` to execute the tests

## part-6-user-service-api-tests

Fill in the implementation in `api-tests/users.test.js`

Run `npm test` to execute the tests

## part-7-user-service-postgres

Refactored the application to use postgres instead of the naive file system storage. 
The postgres repository has already been implemented.
Run `npm run db:migrate` to create the tables required for the application.

Use `DATABASE_URL` in the env to specfy the connection to a postgres instance.

## part-7-github-actions-heroku

Added CI and a way to deploy to heroku. Requires a new github repo and a heroku account

## part-8-user-service-email

Added an email repository to send emails using SMTP.

# Year in Pixels Creator

Year in Pixels Creator is a tool for keeping track of your mood through colors.

https://year-in-pixels-creator.herokuapp.com/#/

It is built with a React frontend, an Express backend, and a MongoDB database. See the [About Page](https://year-in-pixels-creator.herokuapp.com/#/about) for more information.

Currently deployed on Heroku using free web dynos and uses [cron-job](https://cron-job.org/en/) to keep the app awake 24/7.

## Current Features

- Accounts to store all user information online
- One board per year to keep track of your mood visually with colors
- Fully customizable color schemes

## Development

To run the app from the source code, you first need to create a `.env` file with the following parameters:
- ATLAS_URI: MongoDB Atlas URI link for storing data
- PORT: Port that the server will run on
- SESSION_SECRET: Randomly generated string for hashing session information
- VERIFICATION_EMAIL: Gmail used for sending verification emails
- VERIFICATION_PASSWORD: Password for the Gmail

Then, run `npm install` in the root directory to install the dependencies for the server, and then run `npm start` to begin the server backend. In a new terminal, navigate to `/app` and run `npm install` and `npm start` to run the frontend React app.

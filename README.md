# Year in Pixels Creator

Year in Pixels Creator is a tool for keeping track of your mood through colors.
https://year-in-pixels-creator.herokuapp.com/#/

It is built with a React frontend, an Express backend, and a MongoDB database. See the [About Page](https://year-in-pixels-creator.herokuapp.com/#/about) for more information.

Currently deployed on Heroku using free web dynos and uses cron-job to keep the app awake between 8 AM and 12 AM EST. The app will still work between 12 AM and 8 AM, but will require 20-30 seconds to wake up the dynos.

## Current Features

- Accounts to store all user information online
- One board per year to keep track of your mood visually with colors
- Fully customizable color schemes

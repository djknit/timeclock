# Timeclock

### _Timeclock_ is a time manager. This app will replace the spreadsheet that I use to track my work time.

## Contents
* [Links](#links)
* [Project Goals](#project-goals)
* [Action Plan](#action-plan)
* [Project Features](#project-features)
* [Technologies Used](#technologies-used)
* [Instructions for Use](#instructions-for-use)
* [Developer](#developer)

## Links
* GitHub repository: [github.com/djknit/timeclock](https://github.com/djknit/timeclock)

## Project Goals
* Make it as convenient as possible to enter time worked.
* Minimum Viable Product (MVP) should have:
  * Continually update/display time worked for day, week, and month.
  * Automatically display time worked for day, week, and month.
  * Allow user to set day and week cutoff.
  * Allow user to analyze arbitrary range of days.
  * Ability to separate multiple different jobs
  * Optional wage entry and compensation earned calculation
  * User authentication
  * Server and database
  * Proper security measures on backend to prevent unauthorized data access.
* Get working MVP before adding optional features.
* After MVP, add timeclock feature to allow user to "punch in" and "punch out" so that they don't have to write down their time and enter it later.

## Action Plan
Items in italics are currently being worked on.

This plan is not complete. Future steps will be expanded on in the plan before they are developed. 

* [x] Create bare-bones project structure and set up automatic deployment
  * [x] Create repository; initialize node in repo; run create-react-app to create front-end structure.
  * [x] Create express server and configure to serve front-end
  * [x] Add configuration for Mongoose (MongoDB ODM)
  * [x] Add Bash scripts (to package.json) needed for Heroku to install + build
  * [x] Set up automatic deployment to Heroku from github repo.
    * [x] Create 2 Heroku projects. Deploy `dev` branch to 1 project and `master` branch to another.
    * [x] Provision database for both project.
* [ ] _Develop back-end for all MVP features_
  * [ ] _Develop code necessary for user authentication._
    * [x] Create User database model
    * [x] Configure passport. Create controller functions needed to create account and login.
    * [x] Create api routes and remaining controller functions needed for authentication.
      * [x] Create account
      * [x] Test login
      * [x] Login and logout
      * [x] Delete account
      * [ ] _Edit account information_
  * [ ] Develop code necessary for time management
* [ ] Develop front-end to complete MVP
* [ ] Review code for bugs and code organization/readability
* [ ] Work on additional features

## Project Features
(Coming soon...)

## Technologies Used
#### Front End
* React
* Bulma
* Axios
* Moment
* react-router-dom package
* create-react-app package

#### Back End
* Passport (Passport Local Strategy)
* Express
* Node
* MongoDB
* Mongoose
* Bcrypt

#### Public APIs
* Google Books API

## Instructions for Use
(Coming soon...)

## Developer
This project is developed and maintained by David Knittel. Any and all questions, comments, suggestions, or proposed contributions are welcome.
* Email: [djknit@gmail.com](mailto:djknit@gmail.com)
* Portfolio: [djknit.github.io](https://djknit.github.io/)
* GitHub: [github.com/djknit](https://github.com/djknit)
* LinkedIn: [linkedin.com/in/djknit](https://www.linkedin.com/in/djknit/)
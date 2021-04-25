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
* Deployed page: [daves-timeclock.herokuapp.com/](https://daves-timeclock.herokuapp.com/)

## Project Goals
* Make it as convenient as possible to enter time worked.
* Minimum Viable Product (MVP) should have:
  * Continually update/display time worked for day, week, and month.
  * Allow user to set day and week cutoff.
  * Allow user to analyze arbitrary range of days.
  * Ability to separate multiple different jobs
  * Optional wage entry and compensation earned calculation
  * User authentication
  * Server and database
  * Proper security measures on backend to prevent unauthorized data access.
* Get working MVP before adding optional features.
* After MVP, add punchclock feature to allow user to "punch in" and "punch out" so that they don't have to write down their time and enter it later.

## Action Plan
Items in italics are currently being worked on.

This plan is not complete. Future steps will be expanded on in the plan before they are developed. 

* [x] Create bare-bones project structure and set up automatic deployment
  * [x] Create repository; initialize node in repo; run create-react-app to create front-end structure.
  * [x] Create express server and configure to serve front-end
  * [x] Add configuration for Mongoose (MongoDB ODM)
  * [x] Add Bash scripts (to package.json) needed for Heroku to install + build
  * [x] Set up automatic deployment to Heroku from github repo.
    * [x] Create 2 Heroku projects. Deploy ~~`dev`~~ `beta` branch to 1 project and `master` branch to another.
    * [x] Provision database for both project.
* [x] Develop back-end for all MVP features
  * [x] Develop code necessary for user authentication.
    * [x] Create User database model
    * [x] Configure passport. Create controller functions needed to create account and login.
    * [x] Create api routes and remaining controller functions needed for authentication.
      * [x] Create account
      * [x] Test login
      * [x] Login and logout
      * [x] Delete account
      * [x] Edit account information
  * [x] Develop code necessary for time management
    * [x] Create job
    * [x] Get jobs for user (basic info only)
    * [x] Get individual job data (w/ all values populated)
    * [x] Edit job information (`wage`, `dayCutoff`, `timezone`, and `weekBegins`)
    * [x] Change job name
    * [x] Add weeks and days
    * [x] Add time segments
    * [x] Delete time segments (individually by id and in bulk by date)
    * [x] Delete job
* [ ] _Develop front-end to complete MVP_
  * [x] Landing page
  * [x] Account creation & login
  * [x] 404 page
  * [x] Dashboard
    * [x] Add welcome message to display instead of jobs table when user has no jobs
  * [x] Job creation
  * [x] Job page
    * [x] Job dashboard
      * [x] Job basics display and edit
      * [x] Settings summaries and links to settings
      * [ ] ~~Time summary and links~~ (Link done. Moving the rest out of MVP.)
    * [x] Settings page (display and edit settings value schedules)
    * [x] Time page
      * [x] Time Summary
      * [x] Basics
        * [x] General time entry
          * [x] Time segment general entry
          * [x] Track and display segments just added
        * [x] Create recently added segments similarly to just added from general entry
        * [x] Session timezone info and management
      * [x] Allow delete time segment 
      * [x] Allow edit time segment
      * [ ] ~~Time details by weeks/days and corresponding time entry~~ (Combine w/ report)
      * [x] Full report of time data
        * [x] Regular display
        * [ ] ~~PDF or printer-friendly version~~ (Not MVP)
        * [ ] ~~Arbitrary (user defined) time period (default is all time)~~ (Not MVP)
        * [ ] ~~Let user define how much info to include~~ (Not MVP)
  * [x] Navbar navigation menu
  * [ ] _Ensure at least bare minimum mobile responsiveness_
    * [ ] _Ensure all features can be used on all screen sizes_ (do concurrently w/ next step)
    * [ ] _Ensure nothing looks broken or clearly in the wrong place w/ any screen size_
      * [ ] Complete mobile version of job settings value schedule display
      * [ ] Modify full time report for mobile screen size
      * [ ] _Fix form small screen issues_
        * [ ] _On time inputs, `is24hr` inputs overlap rest of field_
        * [ ] Indents not appearing on mobile (all fields aligned to left edge of form)

* [ ] Review code for bugs and code organization/readability (Ongoing)

* [ ] Develop and/or finish developing the most important remaining front-end features for a more complete MVP
  * [ ] Improve full report
    * [ ] Add buttons to edit time throughout report where convenient for user
    * [ ] User defined time period (default is all time) for full report
      * [ ] Period inputs
      * [ ] Utility function to get arbitrary period data
    * [ ] PDF or printer friendly version
  * [ ] User preference for AM/PM or 24hr times setting at user level and/or job level

* [ ] Work on additional features
  * [ ] Punchclock
  * [ ] Add special handling for the edge-case situation where a time-change (ex. daylight savings beginning or end) occurs during a work shift. Likewise if any time is recorded both before and after the time-change on the same day.
  * [ ] Create (or improve existing) mobile friendly UI
  * [ ] Add time section to job dashboard
    * [ ] Summary
    * [ ] Basic actions such as general entry
  * [ ] Let user define how much info to include in time report
    * [ ] Inputs
    * [ ] Display (update regular display)

* Icebox:
  * [ ] Add notes field to time segments & maybe also days and/or weeks
  * [ ] Pay periods (should be optional)
  * [ ] Mark time as finalized and/or paid, and maybe allow finalized time to be locked so it can't be changed
  * [ ] Add manager/supervisor account with priviledges to define job; link to employee account for employee self-reporting of hours; require manager to finalize.

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
* Passport and passport-local
* Express
* Node
* MongoDB
* Mongoose
* Bcrypt
* Moment and moment-timezone
* Currency-codes

## Instructions for Use
(Coming soon...)

## Developer
This project is developed and maintained by David Knittel. Any and all questions, comments, suggestions, or proposed contributions are welcome.
* Email: [djknit@gmail.com](mailto:djknit@gmail.com)
* Portfolio: [djknit.github.io](https://djknit.github.io/)
* GitHub: [github.com/djknit](https://github.com/djknit)
* LinkedIn: [linkedin.com/in/djknit](https://www.linkedin.com/in/djknit/)

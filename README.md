# Timeclock

### _Timeclock_ is a time manager. This app will replace the spreadsheet that I use to track my work time.

## Contents
* [Links](#links)
* [Project Goals](#project-goals)
* [Project Features](#project-features)
* [Technologies Used](#technologies-used)
* [Instructions for Use](#instructions-for-use)
* [Icebox](#icebox)
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

## Project Features
* User authentication
  - Uses Passport.js to manage login sessions
  - User passwords are hashed using bcrypt before they are stored in the database.
  - Login with either username or email address if account has both setup (only 1 of the 2 is required)
  - All access to user data is restricted on the server side so that users are not able to access data that is not theirs using the API
* Allows users to track time worked for one or more separate jobs, with no limit to the number of jobs allowed
* Optional wage settings allow for earnings calculations.
* Dynamic forms throughout the app allows for a simple form with the least number of inputs possible to be displayed to users initially, so the app is not unnecessarily complex, while still allowing options to edit every parameter possible in order to accommodate unique situations especially for more advanced users. Additional inputs are added to forms as needed when the user chooses to customize more parameters.
* Users enter their time using a simple user friendly form.
* Time and earnings are reported automatically by job as well as the totals from all of the user's jobs. Totals are reported by week, month, year, and all time by default.
* All time entered can be viewed and edited by the user.
* Support for practically all timezones and currencies, including situations where more than one is used on the user's account or even the same job if that situation arises.
* The app is automatically deployed to Heroku from the master branch of the Github repo.

## Technologies Used
#### Front End
* React
* Bulma
* Axios
* Moment Timezone
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
Visit [daves-timeclock.herokuapp.com](https://daves-timeclock.herokuapp.com) to run the app.
* On the landing page you can create an account or login.
  * You must create an account to use the app
  * The only information required to set up an account is a username OR email and a password.
  * First time users, create a new account. You will be automatically logged in when the account is created.
* In order to track your time, you must create a job. Click the "+ New" button under the jobs section of the dashboard page, and fill out the form to fit the job or activity that you are tracking time for.
* You can navigate using the nav bar on the top of the page or by clicking through the links on the pages as well as breadcrumb items included with page heading.
* Enter time spent on your "job" by visiting the time page for that job.
* You may create unlimited jobs.
* The settings for each job can be changed by selecting the job and then going to settings.

## Icebox
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
  * [ ] Add notes field to time segments & maybe also days and/or weeks
  * [ ] Pay periods (should be optional)
  * [ ] Mark time as finalized and/or paid, and maybe allow finalized time to be locked so it can't be changed
  * [ ] Add manager/supervisor account with privileges to define job, and link manager account to employee account for employee self-reporting of hours. Require manager to finalize hours.

## Developer
This project is developed and maintained by David Knittel. Any and all questions, comments, suggestions, or proposed contributions are welcome.
* Email: [djknit@gmail.com](mailto:djknit@gmail.com)
* Portfolio: [djknit.github.io](https://djknit.github.io/)
* GitHub: [github.com/djknit](https://github.com/djknit)
* LinkedIn: [linkedin.com/in/djknit](https://www.linkedin.com/in/djknit/)

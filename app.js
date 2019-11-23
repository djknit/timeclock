require('dotenv').config();

require('./config/database');

require('./config/server').start();

console.log(new Date(1999, 11, 31).getTime())
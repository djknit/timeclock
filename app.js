require('dotenv').config();

require('./config/database');

require('./config/server').start();

require('./test');
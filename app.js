const fs = require('fs');

require('./server').start();

/*
Run my scratch paper file if it exists.
  Used for general testing of javascript and/or js libraries when I want to quickly make sure something works the way I think it does before I write it in to the actual project.
  I put the file in `.gitignore`, so it is only present in my local copy of the repository.
*/
if (fs.existsSync('./test.js')) require('./test');
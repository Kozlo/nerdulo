# Nerdulo

This is a single page game application written in Angular.js. The front-end code is thoroughly unit-tested. The application runs Node.js on the server. SASS is used as the CSS pre-processor. Gulp is used for task automation.

## Links
1. Production version can be found on http://nerdulo.com
2. Unit tests can be seeon on http://nerdulo.com/unit_test

## Installation
1. Download the repository
2. Install npm modules: `npm install`
3. Install bower dependencies `bower install`

## Running the app
* Run the gulp start task
 * gulp start
* Build the code and run the app manually:
 * run the gulp build task:
  *`gulp build` to simply build the files
  * or `gulp default -end development` to also watch for file changes and automatic re-build
   * Chrome's livereload plugin is needed for the page to reload automatically
 * start the server:
  *`npm start`
  * or `node server.js`
* View in browser at http://localhost:8080

If you have any questions, please contact Martins at [mkozlovskis@gmail.com](mkozlovskis@gmail.com).

## Running Browser Tests With CasperJS
1. Install prerequisites: PhantomJS 1.9.1 or greater and Python 2.6 or greater
2. Install CasperJS with the global flag: `npm install -g casperjs`
3. Run the tests in the appropriate folder: `casperjs test src/tests/casperjs/tests/`

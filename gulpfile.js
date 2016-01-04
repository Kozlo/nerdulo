var gulp = require('gulp'),
    rimraf = require('gulp-rimraf'),
    ngAnnotate = require('gulp-ng-annotate'), // uglifies the AngularJS-specific code
    sass = require('gulp-sass'), // compiles SASS code
    plumber = require('gulp-plumber'), // let's gulp keep watching even if errors occur in the code
    imagemin = require('gulp-imagemin'),
    environments = require('gulp-environments'), // allows setting for which environments to
    livereload = require('gulp-livereload'),
    nodemon = require('gulp-nodemon');

var prod = environments.production,
    dev = environments.development;

// TODO: add paths variable here and use it in code

// Clean task - deleted the dist folder
gulp.task('clean', function() {
    // IMPORTANT: need to return the stream so that Gulp knows the clean task is asynchronous, and doesn't run dependencies before this is done
    return gulp.src('dist', { read: false })
        .pipe(rimraf());
});

// SASS task - Compiles SASS files into CSS
gulp.task('sass', function() {
    gulp.src('src/scss/**/*.scss')
        .pipe(plumber()) // make sure gulp doesn't break if errors occur
        .pipe(sass.sync({
            outputStyle: 'compressed'
        })
        .on('error', sass.logError))// compress the compiled CSS, also make sure it's run synchronously, otherwise clean command won't work on start
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});

// Scripts Task - Uglifies and moves JS files
gulp.task('scripts', function() {
    // TODO: figure out why ngmin isn't working properly
    gulp.src('src/js/**/*.js')// get all JavaScript files from the js folder
        .pipe(plumber()) // make sure gulp doesn't break if errors occur
        .pipe(prod(ngAnnotate()))// uglify the JS files with the AngularJS-friendly version, do it only on production
        .pipe(gulp.dest('dist/js'))
        .pipe(livereload());
});

// Views section
gulp.task('views', function() {
    // move the index files
    gulp.src('src/index.html') // get all files from all folders
        .pipe(gulp.dest('dist'))
        .pipe(livereload());

    // move all other views
    gulp.src('src/views/**/*.html') // get all files from all folders
        .pipe(gulp.dest('dist/views'))
        .pipe(livereload());
});


// Static files section

// Images section
gulp.task('images', function() {
    gulp.src('src/images/**/*') // get all files from all folders
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
        .pipe(livereload());
});

// Libraries section
gulp.task('libs', function() {
    gulp.src('src/libs/**/*') // get all files from all folders
        .pipe(gulp.dest('dist/libs'))
        .pipe(livereload());
});

// Tests section - if the development environment is used, load tests
gulp.task('tests', function() {
    // For demo purposes I'm now enabling tests on production
    //if (dev()) {
        gulp.src('src/tests/**/*') // get all files from all folders
            .pipe(gulp.dest('dist/tests'))
            .pipe(livereload());
    //}
});

// Static files - task combination task
gulp.task('static', ['images', 'libs']);

// Watch task - Watches JS, SCSS, and HTML for saved changes and builds when changes occur
gulp.task('watch', function() {
    // only add the watchers if running on development
    if (dev()) {
        livereload.listen();
        gulp.watch('src/scss/**/*.scss', ['sass']);
        gulp.watch('src/js/*.js', ['scripts']);
        gulp.watch('src/views/**/*.html', ['views']);
        gulp.watch('src/tests/**/*', ['tests']);
    }
});

// server start task. also runs build before starting
gulp.task('start', ['build'], function () {
    livereload.listen();
    nodemon({
        script: 'server.js'
        , ext: 'js html css scss'
        , env: { 'NODE_ENV': 'development' }
        , ignore: ["dist/*"] // add this otherwise an infinite loop will occur
        , tasks: ['build'] // only build the files, but don't watch them separately
    })
    .on('start', function() {
        // even though this is not a great solution, this is the only way to livereload with nodemon
        setTimeout(function () {
            livereload.reload();
        }, 500);
    });
});

// The build task runs clean and all build tasks
gulp.task('build', ['clean'], function() {
    gulp.start(['sass', 'scripts', 'views', 'static', 'tests']);
});

// The default runs the build task and starts the watch task
gulp.task('default', ['build'], function() {
    gulp.start(['watch'])
});
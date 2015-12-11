var gulp = require('gulp'),
    clean = require('gulp-clean'),
    ngmin = require('gulp-ngmin'), // uglifies the AngularJS-specific code
    sass = require('gulp-sass'), // compiles SASS code
    plumber = require('gulp-plumber'), // let's gulp keep watching even if errors occur in the code
    imagemin = require('gulp-imagemin'),
    environments = require('gulp-environments'), // allows setting for which environments to
    livereload = require('gulp-livereload');

var prod = environments.production,
    dev = environments.development;

// TODO: add paths variable here and use it in code

// Clean task - deleted the dist folder
gulp.task('clean', function() {
    // IMPORTANT: need to return the stream so that Gulp knows the clean task is asynchronous, and doesn't run dependencies before this is done
    return gulp.src('dist', { read: false })
        .pipe(clean());
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
        .pipe(prod(ngmin()))// uglify the JS files with the AngularJS-friendly version, do it only on production
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
    }
});

// The default task simply runs other tasks by passing the name of the tasks in an array
// the very first task cleans the directory to make sure no old files are there
gulp.task('default', ['clean'], function() {
    gulp.start(['sass', 'scripts', 'views', 'static', 'tests', 'watch'])
});
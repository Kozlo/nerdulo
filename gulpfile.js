var gulp = require('gulp'),
    clean = require('gulp-clean'),
    ngmin = require('gulp-ngmin'), // uglifies the AngularJS-specific code
    sass = require('gulp-sass'), // compiles SASS code
    plumber = require('gulp-plumber'), // let's gulp keep watching even if errors occur in the code
    imagemin = require('gulp-imagemin');

// TODO: add paths variable here and use it in code

// Clean task
gulp.task('clean', function() {
    // IMPORTANT: need to return the stream so that Gulp knows the clean task is asynchronous, and doesn't run dependencies before this is done
    return gulp.src('dist', { read: false })
        .pipe(clean());
});

// SASS task
// Compiles SASS files into CSS
gulp.task('sass', function() {
    gulp.src('src/scss/**/*.scss')
        .pipe(plumber()) // make sure gulp doesn't break if errors occur
        .pipe(sass.sync({
            outputStyle: 'compressed'
        }).on('error', sass.logError))// compress the compiled CSS, also make sure it's run synchronously, otherwise clean command won't work on start
        .pipe(gulp.dest('dist/css'));
});

// Scripts Task
// Uglifies and moves JS files
gulp.task('scripts', function() {
    // TODO: figure out why ngmin isn't working properly
    gulp.src('src/js/**/*.js')// get all JavaScript files from the js folder
        .pipe(plumber()) // make sure gulp doesn't break if errors occur
        .pipe(ngmin()) // uglify the JS files with the AngularJS-friendly version
        .pipe(gulp.dest('dist/js'));
});

gulp.task('views', function() {
    // move the index files
    gulp.src('src/index.html') // get all files from all folders
        .pipe(gulp.dest('dist'));
    // move all other views
    gulp.src('src/views/**/*.html') // get all files from all folders
        .pipe(gulp.dest('dist/views'));
});


// Static files section

// Images section
gulp.task('images', function() {
    gulp.src('src/images/**/*') // get all files from all folders
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
});

// libraries section
gulp.task('libs', function() {
    gulp.src('src/libs/**/*') // get all files from all folders
        .pipe(gulp.dest('dist/libs'));
});

// Static files task combination task
gulp.task('static', ['images', 'libs']);

// Watch task
// Watches JS to saved changes and builds when changes occur
gulp.task('watch', function() {
    if (!isProduction()) {
        gulp.watch('src/scss/**/*.scss', ['sass']);
        gulp.watch('src/js/*.js', ['scripts']);
    }
});

// The default task simply runs other tasks by passing the name of the tasks in an array
// the very first task cleans the directory to make sure no old files are there
gulp.task('default', ['clean'], function() {
    gulp.start(['sass', 'scripts', 'views', 'static', 'watch'])
});

function isProduction() {
    return process.env.NODE_ENV === "PRODUCTION"
}
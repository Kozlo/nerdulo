var gulp = require('gulp'),
    clean = require('gulp-clean'),
    ngmin = require('gulp-ngmin'), // uglifies the AngularJS-specific code
// TODO: add back one SASS has been added to project
    //sass = require('gulp-ruby-sass'), // compiles SASS code
    plumber = require('gulp-plumber'); // let's gulp keep watching even if errors occur in the code

// Clean task
gulp.task('clean', function() {
    gulp.src('dist')
        .pipe(clean({
            read: false
        }));
});

// TODO: replace with SASS files when it will be added to project
gulp.task('css', function() {
    gulp.src('src/css/**/*.css') // get all files from all folders
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
        .pipe(gulp.dest('dist/images'));
});

// libraries section
gulp.task('libs', function() {
    gulp.src('src/libs/**/*') // get all files from all folders
        .pipe(gulp.dest('dist/libs'));
});

// Static files task combination task
gulp.task('static', ['images', 'libs']);

// TODO: add once SASS has been added to project
//gulp.task('styles', function() {
//    gulp.src('scss/**/*.scss')
//	.pipe(plumber()) // make sure gulp doesn't break if errors occur
//	.pipe(sass({
//	    style: 'compressed'
//	})) // compress the compiled CSS
//	.pips(gulp.dest('css/'));
//});

// Watch task
// Watches JS to saved changes and builds when changes occur
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['scripts']);
    // TODO: add once the
    //gulp.watch('scss/**/*.scss', ['styles']);
});

// The default task simply runs other tasks by passing the name of the tasks in an array
// the very first task cleans the directory to make sure no old files are there
gulp.task('default', ['clean', 'css', 'scripts', 'views', 'static']);
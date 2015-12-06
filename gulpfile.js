var gulp = require('gulp'),
    uglify = require('gulp-uglify');

gulp.task('default', function() {
    // TODO: change folder structure and put the minified code in public, and the rest in a different folder
    //gulp.src('public/js/**/*.js') // load the files
    //    .pipe(uglify()) // uglify them
    //    .pipe(gulp.dest('minjs')); //put the files in the specified folder
});

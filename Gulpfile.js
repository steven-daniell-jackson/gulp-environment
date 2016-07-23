var gulp = require('gulp'),
        sass = require('gulp-ruby-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        minifycss = require('gulp-minify-css'),
        rename = require('gulp-rename'),
        concatCss = require('gulp-concat-css');

gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 35729}));
  app.use(express.static(__dirname));
  app.listen(3000, '0.0.0.0');
});

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('concat-css', function () {
  return gulp.src('css/**/*.min.css')
    .pipe(concatCss("css/bundle.min.css"))
    .pipe(minifycss())
    .pipe(gulp.dest(''));
});

gulp.task('styles', function() {
  return sass('sass', { style: 'expanded' })
    .pipe(gulp.dest('css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('css'));
});

gulp.task('watch', function() {
  gulp.watch('sass/*.scss', ['styles']);
  gulp.watch('*.html', notifyLiveReload);
  gulp.watch('css/*.css', notifyLiveReload);
});

gulp.task('default', ['styles', 'express', 'livereload', 'watch'], function() {

});
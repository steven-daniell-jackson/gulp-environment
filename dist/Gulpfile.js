var gulp = require('gulp'),
sass = require('gulp-ruby-sass'),
autoprefixer = require('gulp-autoprefixer'),
minifycss = require('gulp-minify-css'),
rename = require('gulp-rename'),
concatCss = require('gulp-concat-css'),
htmlmin = require('gulp-htmlmin'),
replace = require('gulp-replace-task');

// Express server
gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 35729}));
  app.use(express.static(__dirname));
  app.listen(3000, '0.0.0.0');
});

// LiveReload
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

// Combine CSS
gulp.task('concat-css', function () {
  return gulp.src('src/css/**/*.min.css')
  .pipe(concatCss("src/css/bundle.min.css"))
  .pipe(minifycss())
  .pipe(gulp.dest(''));
});

// Minify HTML
gulp.task('min-html', function() {
  return gulp.src('*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('dist'))
});

// Minify CSS
gulp.task('styles', function() {
  return sass('src/sass', { style: 'expanded' })
  .pipe(gulp.dest('src/css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('src/css'));
});

// Copy to /dist/ directory
gulp.task('copy', function(){

  // Specific files
  gulp.src('.htaccess')
  .pipe(gulp.dest('dist'));

  gulp.src('.gitignore')
  .pipe(gulp.dest('dist'));

  gulp.src('Gulpfile.js')
  .pipe(gulp.dest('dist'));

  gulp.src('Readme')
  .pipe(gulp.dest('dist'));

  gulp.src('package.json')
  .pipe(gulp.dest('dist'));

// CSS, JS and IMG directories
gulp.src('src/css/**')
.pipe(gulp.dest('dist/css'));

gulp.src('src/js/**')
.pipe(gulp.dest('dist/js'));

gulp.src('src/img/**')
.pipe(gulp.dest('dist/img'));
});

// Replace /src/
gulp.task('replace', function() {
    gulp.src('./index.html')
        .pipe(replace({
            patterns: [
                {
                    match: 'src/',
                    replacement: ''
                }
            ]
        }))
        .pipe(gulp.dest('dist/'))
      });

// Watch for changes and reload page
gulp.task('watch', function() {
  gulp.watch('src/sass/*.scss', ['styles']);
  gulp.watch('*.html', notifyLiveReload);
  gulp.watch('src/css/*.css', notifyLiveReload);
});

// Task sequence for "dist"

gulp.task('start-concat-css', ['concat-css'], function() {
  gulp.start('start-min-html')
});

gulp.task('start-min-html', ['min-html'], function() {
  gulp.start('start-replace')
});

gulp.task('start-replace', ['replace'], function() {
  gulp.start('start-copy')
});

gulp.task('start-copy', ['copy'], function() {});


// "dist" task. Start sequence
gulp.task('dist', ['replace','start-concat-css'], function() {});

// Default config
gulp.task('default', ['styles', 'express', 'livereload', 'watch'], function() {

});
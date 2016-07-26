var gulp = require('gulp'),
sass = require('gulp-ruby-sass'),
autoprefixer = require('gulp-autoprefixer'),
minifycss = require('gulp-minify-css'),
rename = require('gulp-rename'),
concatCss = require('gulp-concat-css'),
htmlmin = require('gulp-htmlmin'),
replace = require('gulp-replace-task'),
runSequence = require('run-sequence'),
clean = require('gulp-clean'),
tinypng = require('gulp-tinypng'),
urlAdjuster = require('gulp-css-url-adjuster');

// Express server
gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 35729}));
  app.use(express.static(__dirname + "/src"));
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





// DISTRIBUTION

// Minify HTML
gulp.task('min-html', function() {
  return gulp.src('src/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('dist'))

});

// Combine CSS and minify css
gulp.task('concat-css', function () {
  return gulp.src('src/css/**/*.min.css')
  .pipe(concatCss("src/css/bundle.min.css"))
  .pipe(minifycss())
  .pipe(gulp.dest(''));

  callback();
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

// CSS, JS directories
gulp.src('src/css/**')
.pipe(gulp.dest('dist/css'));

// CSS, JS directories
gulp.src('src/*.html')
.pipe(gulp.dest('dist/'));

gulp.src('src/js/**')
.pipe(gulp.dest('dist/js'));

});

// Replace /src/ in html
gulp.task('replace', function() {
  gulp.src('./dist/*.html')
  .pipe(replace({
    patterns: [
    {
      match: /src/g,
      replacement: '.'
    }
    ]
  }))
  .pipe(gulp.dest('dist/'))


});



// Replace /src/ in CSS
gulp.task('replace-css', function() {
 gulp.src('./dist/css/bundle.min.css').
 pipe(urlAdjuster({
  replace:  ['../../../img','../img'],
}))
 .pipe(minifycss())
 .pipe(gulp.dest('./dist/css/'));
});


// Clean directory
gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
  .pipe(clean());
});


// "dist" task. Start sequence
gulp.task('dist', function(callback) {
    // runSequence('clean', ['concat-css', 'min-html', 'replace', 'copy'], callback);
    runSequence('clean', 'concat-css', 'min-html', 'copy', 'replace', function() {

      
    });
    
  });

// END DISTRIBUTION


// PRODUCTION

// Combine CSS and minify css
gulp.task('prod-concat-css', function () {
  return gulp.src('src/css/**/*.min.css')
  .pipe(concatCss("src/css/bundle.min.css"))
  // .pipe(minifycss())
  .pipe(gulp.dest(''));

  callback();
});

// Copy to /dist/ directory
gulp.task('prod-copy', function(){

  // Specific files
  gulp.src('.htaccess')
  .pipe(gulp.dest('prod'));

  gulp.src('.gitignore')
  .pipe(gulp.dest('prod'));

  gulp.src('Gulpfile.js')
  .pipe(gulp.dest('prod'));

  gulp.src('Readme')
  .pipe(gulp.dest('prod'));

  gulp.src('package.json')
  .pipe(gulp.dest('prod'));

// CSS, JS directories
gulp.src('src/css/**')
.pipe(gulp.dest('prod/css'));

// CSS, JS directories
gulp.src('src/*.html')
.pipe(gulp.dest('prod/'));

gulp.src('src/js/**')
.pipe(gulp.dest('prod/js'));

});

// Replace /src/ in html
gulp.task('prod-replace', function() {
  gulp.src('./prod/*.html')
  .pipe(replace({
    patterns: [
    {
      match: /src/g,
      replacement: '.'
    }
    ]
  }))
  .pipe(gulp.dest('prod/'))


});


// Clean directory
gulp.task('prod-clean', function () {
  return gulp.src('prod', {read: false})
  .pipe(clean());
});




// "prod" task. Start sequence
gulp.task('prod', function(callback) {
    // runSequence('clean', ['concat-css', 'min-html', 'replace', 'copy'], callback);
    runSequence('prod-clean', 'prod-concat-css', 'prod-copy', 'prod-replace', function() {

      
    });
    
  });

// END PRODUCTION



// Watch for changes and reload page
gulp.task('watch', function() {
  gulp.watch('src/sass/*.scss', ['styles']);
  gulp.watch('src/*.html', notifyLiveReload);
  gulp.watch('src/css/*.css', notifyLiveReload);
});



// Compress images using tinypng API
gulp.task('tinypng', function () {
  gulp.src('src/**/*.png')
  .pipe(tinypng('UHTk65aGnnMbspZF8K7-Kvnq_DrON7ya'))
  .pipe(gulp.dest('./dist'));
});

// Default config
gulp.task('default', ['styles', 'express', 'livereload', 'watch'], function() {

});
/* globals require */
var gulp = require('gulp');
var del = require('del');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

gulp.task('clean', function (done) {
  del(['dist/*']).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n')); // eslint-disable-line no-console, no-undef
    done();
  });
});

gulp.task('inject', function () {
  return gulp.src('leafblower.jscad')
    .pipe(plugins.plumber())
    .pipe(plugins.inject(gulp.src('node_modules/**/jscad.json')
      .pipe(plugins.plumber())
      .pipe(plugins.jscadFiles()), {
        relative: true,
        starttag: '// include:js',
        endtag: '// endinject',
        transform: function (filepath, file) {
          return '// ' + filepath + '\n' + file.contents.toString('utf8');
        }
      }))
    .pipe(gulp.dest('dist'));
});

gulp.task('docs', ['inject'], function() {
  return gulp.src('package.json')
    .pipe(plugins.plumber())
    .pipe(plugins.openjscadStandalone())
    .pipe(gulp.dest('docs'));
});

gulp.task('default', ['clean', 'inject', 'docs'], function () {
  plugins.watch(['!**/*.*~', '!dist/*', '**/*.jscad', 'node_modules/'], {
    verbose: true,
    followSymlinks: true,
    readDelay: 500
  }, function () {
    gulp.start('inject');
  });
});

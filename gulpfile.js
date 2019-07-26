 const browsersync = require('browser-sync'),
       gulp = require('gulp'),
       notify = require('gulp-notify'),
       rename = require('gulp-rename'),
       sass = require('gulp-sass'),
       sourcemaps = require('gulp-sourcemaps');

const paths = {
  root: './',
  css: {
    src: './src/scss',
    dist: './dist/css'
  },
  icon: {
    error: './src/icons/icon-error.png',
    success: './src/icons/icon-success.png'
  }
}

let app = {
  sass: {
    options: { outputStyle: 'compressed' }
  },
  notify: {
    error: {
      message: 'Houve falha na transpilação dos arquivos.',
      options: {
        title: 'Ooops!',
        appID: 'CSS Grid System',
        icon: paths.icon.error
      }
    },
    success: {
      options: {
        title: 'WOW!',
        message: 'Arquivo CSS atualizado com sucesso.',
        appID: 'CSS Grid System',
        icon: paths.icon.success,
        onLast: true
      }
    }
  }
}

gulp.task('pack-css', () => {
  return gulp
    .src(`${paths.css.src}/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass(app.sass.options))
    .on('error', sass.logError)
    .on('error', (err) => {
      return notify(app.notify.error.options).white(app.notify.error.message);
    })
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.css.dist))
    .pipe(notify(app.notify.success.options))
    .pipe(browsersync.reload({ stream: true }))
});

gulp.task('reload', () => {
  return gulp
    .src(paths.root)
    .pipe(browsersync.reload({ stream: true }))
});

gulp.task('browser-sync', gulp.series('pack-css', () => {
  browsersync.init({
    server: {
      baseDir: paths.root,
      index: './index.html'
    },
    port: 3000
  });

  gulp.watch('./*.html', gulp.series('reload'));
  gulp.watch(`${paths.css.src}/*.scss`, gulp.series('pack-css'));
}));

gulp.task('default', gulp.series('browser-sync', () => {
  console.log('>>> Gulp works like a charm.');
}));

// gulp.task('default', gulp.series('browser-sync'), async () => {
//   console.log('>>> Gulp works like a charm.');
// });

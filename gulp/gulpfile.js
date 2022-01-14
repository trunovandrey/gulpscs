const {src , dest , task , series , watch}  = require('gulp');

const rm = require( 'gulp-rm' );

const sass = require("gulp-sass")(require("node-sass"));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const sassGlob = require('gulp-sass-glob');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemap');

const (SRC_PATH , DIST_PATH , STYLE_LIBS)  = require('./gulp.config');

task( 'clean', () =>{
    return src( 'dist/**/*', { read: false }).pipe( rm() );
  });

  task( 'copy:html',() =>{
    return src('src/*.html').pipe(dest('dist')).pipe(reload({stream: true}));
  });

  const styles = [
      'node_modules/normalize.css/normalize.css',
      'src/styles/main.scss'
  ]

  task( "styles",() =>{
    return src(styles)
    .pipe(sourcemaps.init())
    .pipe(concat("main.scss"))
    .pipe(sassGlob())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({
      browsers:["last 2 version"],
			cascade: false,
		}))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(dest("dist"));
  });

  task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        open:false
    });
});

  watch('./src/styles/**/*.scss', series("styles"));
  watch('./src/*.html', series('copy:html'));

  task('default', series('clean','copy:html', 'styles ' , 'server' ));




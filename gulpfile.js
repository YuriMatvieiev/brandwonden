const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const fileInclude = require("gulp-file-include");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");

// Paths
const paths = {
  html: {
    src: "src/**/*.html",
    dest: "dist/",
  },
  scss: {
    src: "src/scss/**/*.scss",
    dest: "dist/css/",
  },
  assets: {
    src: "src/assets/**/*",
    dest: "dist/assets/",
  },
};

// Compile SCSS
function compileScss() {
  return gulp
    .src("src/scss/main.scss") // головний файл!
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

// Include HTML components
function includeHtml() {
  return gulp
    .src(["src/*.html", "!src/components/**/*.html"])
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Copy assets
function copyAssets() {
  return gulp
    .src(paths.assets.src)
    .pipe(gulp.dest(paths.assets.dest))
    .pipe(browserSync.stream());
}

// Browser Sync
function serve() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    port: 3000,
    open: true,
  });

  gulp.watch(paths.scss.src, compileScss);
  gulp.watch(paths.html.src, includeHtml);
  gulp.watch(paths.assets.src, copyAssets);
}

// Build task
const build = gulp.series(gulp.parallel(compileScss, includeHtml, copyAssets));

// Default task
const dev = gulp.series(
  gulp.parallel(compileScss, includeHtml, copyAssets),
  serve
);

exports.compileScss = compileScss;
exports.includeHtml = includeHtml;
exports.copyAssets = copyAssets;
exports.build = build;
exports.default = dev;

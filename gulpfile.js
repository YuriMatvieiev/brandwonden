const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const fileInclude = require("gulp-file-include");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");

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
  components: {
    js: "src/components/**/*.js",
    dest: "dist/assets/js/",
  },
};

// Compile SCSS
function compileScss() {
  return gulp
    .src("src/scss/main.scss") // main file
    .pipe(
      sass({
        outputStyle: "expanded",
        includePaths: ["src/scss", "src/components"],
      }).on("error", sass.logError)
    )
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
        context: {
          componentsPath: "src/components",
        },
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

// Bundle component JS files into one file
function bundleComponentJs() {
  return gulp
    .src(paths.components.js)
    .pipe(concat("main.js"))
    .pipe(gulp.dest(paths.components.dest))
    .pipe(browserSync.stream());
}

// Browser Sync
function serve() {
  browserSync.init(
    {
      server: {
        baseDir: "./dist",
      },
      port: 3000,
      // Use listen instead of host for better compatibility
      listen: "0.0.0.0",
      open: false, // Don't auto-open browser
      notify: false, // Disable notifications
      ui: {
        port: 3001,
      },
      // Enable external access
      proxy: false,
    },
    function (err, bs) {
      // Log the network URL after initialization
      if (!err) {
        console.log("\n✅ [Browsersync] Server started successfully!");
        console.log("\n📍 Access URLs:");
        console.log("   Local:    http://localhost:3000");
        console.log("   Network:  http://192.168.0.105:3000");
      }
    }
  );

  gulp.watch(paths.scss.src, compileScss);
  gulp.watch("src/components/**/*.scss", compileScss);
  gulp.watch(paths.html.src, includeHtml);
  gulp.watch(paths.assets.src, copyAssets);
  gulp.watch(paths.components.js, bundleComponentJs);
}

// Build task
const build = gulp.series(
  gulp.parallel(compileScss, includeHtml, copyAssets, bundleComponentJs)
);

// Default task
const dev = gulp.series(
  gulp.parallel(compileScss, includeHtml, copyAssets, bundleComponentJs),
  serve
);

exports.compileScss = compileScss;
exports.includeHtml = includeHtml;
exports.copyAssets = copyAssets;
exports.bundleComponentJs = bundleComponentJs;
exports.build = build;
exports.default = dev;

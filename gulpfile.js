const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const fileInclude = require("gulp-file-include");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const os = require("os");

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

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "192.168.0.105"; // Fallback
}

// Browser Sync
function serve() {
  const localIP = getLocalIP();

  const bsConfig = {
    server: {
      baseDir: "./dist",
    },
    port: 3000,
    host: "0.0.0.0", // Listen on all network interfaces
    open: false, // Don't auto-open browser
    notify: false, // Disable notifications
    ui: {
      port: 3001,
    },
    online: true, // Enable network access
  };

  browserSync.init(bsConfig, function (err, bs) {
    // Log the network URL after initialization
    if (!err) {
      console.log("\n✅ [Browsersync] Server started successfully!");
      console.log("\n📍 Access URLs:");

      // Get network URLs from BrowserSync
      const options = bs.options;
      let networkUrl = null;

      if (options && options.urls) {
        const urls = options.urls;
        if (urls.local) {
          console.log(`   Local:    ${urls.local}`);
        } else {
          console.log("   Local:    http://localhost:3000");
        }
        if (urls.external) {
          networkUrl = urls.external;
          console.log(`   Network:  ${networkUrl}`);
        }
      } else {
        console.log("   Local:    http://localhost:3000");
      }

      if (!networkUrl) {
        console.log(`   Network:  http://${localIP}:3000`);
      }
    } else {
      console.error("❌ Error starting BrowserSync:", err);
    }
  });

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

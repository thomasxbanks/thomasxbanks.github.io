// Gulp
const {
  dest, parallel, series, src, watch,
} = require('gulp');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const noop = require('gulp-noop');
const del = require('del');
const zip = require('gulp-zip');
const fetch = require('isomorphic-fetch');

// Dev
const browserSync = require('browser-sync').create();

// Css
const sass = require('gulp-sass');
const purify = require('gulp-purifycss');

// Templates
const fileinclude = require('gulp-handlebars-file-include');

// JS
const rollup = require('gulp-better-rollup');
const { eslint } = require('rollup-plugin-eslint');
const babel = require('rollup-plugin-babel');
const minify = require('rollup-plugin-babel-minify');
const strip = require('@rollup/plugin-strip');
const cleanup = require('rollup-plugin-cleanup');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

// HTML
const htmlmin = require('gulp-htmlmin');
const htmlreplace = require('gulp-html-replace');

// Images
const imagemin = require('gulp-imagemin');
// const unimage = require('gulp-unimage');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');

const packageJson = require('./package.json');

const isProduction = (process.env.NODE_ENV === 'production');

const banner = `/* LXLabs ${packageJson.name} v${packageJson.version} */`;

const root = './';
const source = 'src/';
const dist = '';

const path = {
  css: {
    in: `${root}${source}assets/css/`,
    out: `${root}${dist}css/`,
    main: 'style.scss',
    pattern: '*.{css,scss}',
  },
  js: {
    in: `${root}${source}assets/js/`,
    out: `${root}${dist}js/`,
    main: 'index.js',
    pattern: '*.{js,ts}',
  },
  vendor: {
    in: `${root}${source}assets/vendor/*.js`,
    out: `${root}${dist}vendor/`,
  },
  static: {
    in: `${root}${source}static/**/*.*`,
    out: `${root}${dist}`,
  },
  img: {
    in: `${root}${source}assets/images/**/*.{jpg,png,svg,gif}`,
    out: `${root}${dist}images/`,
  },
  hbs: {
    in: `${root}${source}`,
    out: `${root}${dist}/`,
    main: 'index.hbs',
    pattern: '*.hbs',
  },
};

const data = require('./src/data.js');

const api = async (endpoint) => {
  const raw = await fetch(endpoint);
  const response = await raw.json();
  return response;
};

const endpoint = {
  user: 'https://api.github.com/users/thomasxbanks',
  projects: 'https://api.github.com/users/thomasxbanks/repos?page=1&per_page=6',
  posts: 'http://scrummable.com/wp-json/wp/v2/posts',
};

const getData = async () => {
  data.user = await api(endpoint.user);
  data.projects = await api(endpoint.projects);
  data.posts = await api(endpoint.posts);
  data.posts.map(async (post) => {
    const featured_image = await api(`http://scrummable.com/wp-json/wp/v2/media/${post.featured_media}`);
    console.log(featured_image);
    post.thumbnail = featured_image.media_details.sizes.medium_large;
    return post;
  });
  console.log(data);
};


const envs = ['index'];

const cssMinPlugins = {
  outputStyle: isProduction ? 'compressed' : 'expanded',
  precision: 2,
};

const babelOptions = {
  babelrc: false,
  exclude: [/\/core-js\//, /node_modules/],
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        modules: false,
        useBuiltIns: 'usage',
      },
    ],
  ],
};

const jsMinPlugins = [
  isProduction ? noop() : eslint({ configFile: './.eslintrc.json', fix: isProduction }),
  commonjs(),
  nodeResolve({ jsnext: true, browser: true }),
  isProduction ? babel(babelOptions) : noop(),
  isProduction ? strip({ sourceMap: false }) : noop(),
  cleanup({ comments: isProduction ? 'none' : 'all', extensions: ['js'] }),
  minify({ banner, bannerNewLine: true }),
];

const imageMinPlugins = [
  imageminMozjpeg({}),
  imageminOptipng({ optimizationLevel: 5 }),
  imageminSvgo({ plugins: [{ removeViewBox: true }, { cleanupIDs: false }] }),
];

const clean = async (cb) => del([`${root}${dist}`], cb);

const css = () => src(`${path.css.in}${path.css.main}`)
  .pipe(isProduction ? noop() : sourcemaps.init())
  .pipe(sass(cssMinPlugins).on('error', sass.logError))
  .pipe(isProduction ? purify([`${path.hbs.out}**/*.html`, `${path.js.out}**/*.js`], { minify: true, rejected: true }) : noop())
  .pipe(isProduction ? noop() : sourcemaps.write())
  .pipe(dest(path.css.out))
  .pipe(browserSync.stream());

const js = () => src(`${path.js.in}${path.js.main}`)
  .pipe(isProduction ? noop() : sourcemaps.init())
  .pipe(rollup({
    plugins: jsMinPlugins,
  }, 'cjs'))
  .pipe(isProduction ? noop() : sourcemaps.write())
  .pipe(dest(path.js.out))
  .pipe(browserSync.stream());

const vendor = () => src(path.vendor.in)
  .pipe(concat('index.js'))
  .pipe(dest(path.vendor.out))
  .pipe(browserSync.stream());

const template = () => src(`${path.hbs.in}**/${path.hbs.main}`)
  .pipe(fileinclude(data))
  .pipe(rename((p) => { p.extname = '.html'; return path; }))
  .pipe(dest(path.hbs.out));

const html = () => src(`${root + dist}**/*.html`)
  // .pipe(isProduction ? htmlmin({ collapseWhitespace: true }) : noop())
  .pipe(dest(root + dist))
  .pipe(browserSync.stream());

const images = () => src(path.img.in)
  // .pipe(isProduction ? unimage({ base: __dirname, files: [`${path.hbs.out}**/${path.hbs.pattern}`, `${path.css.out}**/${path.css.pattern}`], debug: false }) : noop())
  .pipe(isProduction ? imagemin(imageMinPlugins) : noop())
  .pipe(dest(path.img.out))
  .pipe(browserSync.stream());

const resources = () => src([path.static.in, './help.txt'], { base: root + source })
  .pipe(dest(path.static.out))
  .pipe(browserSync.stream());

const generate = (cb) => envs.forEach((env) => {
  src(`${path.hbs.out}/index.html`)
    .pipe(htmlreplace({ device: `<body data-environment="${env}">` }))
    .pipe(rename(`${env}.html`))
    .pipe(dest(`${path.hbs.out}`));
  cb();
});

const compress = () => src(`${root}${dist}**/*.*`)
  .pipe(zip(`${packageJson.name}.zip`))
  .pipe(dest(root));

const compile = series(getData, template, html, js, css, parallel(vendor, images, resources));
const serve = () => {
  browserSync.init({
    server: root + dist,
  });
  watch([`${path.hbs.in}**/${path.hbs.pattern}`], template);
  watch([`${path.css.in}**/${path.css.pattern}`], css);
  watch([`${path.js.in}**/${path.js.pattern}`], js);
  watch([`${path.img.in}**/${path.img.pattern}`], images);
};

exports.clean = clean;
exports.default = series(compile, serve);
exports.build = series(compile, generate, compress);

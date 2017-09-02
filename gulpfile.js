const gulp = require('gulp')
const cp = require('child_process')
const BrowserSync = require('browser-sync')
const svgstore = require('gulp-svgstore')
const svgmin = require('gulp-svgmin')
const inject = require('gulp-inject')
const replace = require('gulp-replace')

const browserSync = BrowserSync.create()
let hugoBin = `./bin/hugo.${process.platform === 'win32' ? 'exe' : process.platform}`
hugoBin = `hugo`
const defaultArgs = ['-d', '../dist', '-s', 'site']

gulp.task('hugo', (cb) => buildSite(cb))
gulp.task('hugo-preview', (cb) => buildSite(cb, ['--buildDrafts', '--buildFuture']))

gulp.task('cms', () => {
  const match = process.env.REPOSITORY_URL ? process.env.REPOSITORY_URL : cp.execSync('git remote -v', {encoding: 'utf-8'})
  let repo = null
  match.replace(/github.com:(\S+)(\.git)?/, (_, m) => {
    repo = m.replace(/\.git$/, '')
  })
  gulp.src('./src/admin/*')
    .pipe(replace('<% GITHUB_REPOSITORY %>', repo))
    .pipe(gulp.dest('./dist/admin'))
    .pipe(browserSync.stream())
})

gulp.task('build', ['hugo', 'cms'])
gulp.task('build-preview', ['css', 'hugo-preview'])

gulp.task('svg', () => {
  const svgs = gulp
    .src('site/static/img/icons/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}))

  function fileContents (filePath, file) {
    return file.contents.toString()
  }

  return gulp
    .src('site/layouts/partials/svg.html')
    .pipe(inject(svgs, {transform: fileContents}))
    .pipe(gulp.dest('site/layouts/partials/'))
})

gulp.task('server', ['hugo', 'svg', 'cms'], () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })
  gulp.watch('./src/cms/*', ['cms'])
  gulp.watch('./site/static/img/icons/*.svg', ['svg'])
  gulp.watch('./site/**/*', ['hugo'])
})

function buildSite (cb, options) {
  const args = options ? defaultArgs.concat(options) : defaultArgs
  return cp.spawn(hugoBin, args, {stdio: 'inherit'}).on('close', (code) => {
    if (code === 0) {
      browserSync.reload('notify:false')
      cb()
    } else {
      browserSync.notify('Hugo build failed :(')
      cb('Hugo build failed')
    }
  })
}

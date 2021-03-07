const gulp = require('gulp');
const ts = require('gulp-typescript');
const javascriptObfuscator = require("gulp-javascript-obfuscator");
const tsProject = ts.createProject('tsconfig.json');
let distDir = './dist/build';
let projectServerDir = './rest';
gulp.task('compile',() => {
    let tsResult = tsProject.src().pipe(tsProject());
    return tsResult.js.pipe(gulp.dest(distDir));
});
gulp.task('encrypt',()=>{
  return gulp.src(distDir+'/**/*.js').pipe(javascriptObfuscator({
      compact: true,
      controlFlowFlattening: true,
      deadCodeInjection: false,
      disableConsoleOutput: false,
      identifierNamesGenerator: "hexadecimal",
      renameGlobals: false,
      rotateStringArray: true,
      shuffleStringArray: true,
      splitStrings: true,
      splitStringsChunkLength: 5,
      stringArray: true,
      transformObjectKeys: true,
    })
  ).pipe(gulp.dest(distDir));;
});

gulp.task('config',() => {
    return gulp.src('./config.json').pipe(gulp.dest(distDir))
});
gulp.task('watch_typescript', () => {
    let typescriptPath = projectServerDir+'**/*.*';
    return gulp.watch(typescriptPath, gulp.series(['default']));
});
gulp.task('dev', gulp.parallel(['watch_typescript']));
gulp.task('default', gulp.series(['config','compile']));

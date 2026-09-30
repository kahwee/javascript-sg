# javascript-sg

Historical Hugo/Gulp source for JavaScript.sg. Posts live in
[site/content/post/](site/content/post/); the theme is
[site/themes/embryo/](site/themes/embryo/).

## Local workflow

The committed scripts require Hugo on PATH, Node, and Yarn:

```sh
npm install
npm start
npm run build
```

`start` builds Hugo/CMS assets and serves `dist/` with BrowserSync. `build`
also installs and builds the theme through Yarn. Both root npm and Yarn
lockfiles are retained; this pass does not select or migrate the old toolchain.

These commands were checked against [package.json](package.json) and
[gulpfile.js](gulpfile.js), but the historical dependencies were not installed
or rebuilt on the current runtime.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create directory structure
const publicDir = path.join(__dirname, 'public');
const assetsDir = path.join(publicDir, 'assets');
const cssDir = path.join(assetsDir, 'css', 'one-page-parallax');
const jsDir = path.join(assetsDir, 'js', 'one-page-parallax');

// Clean and create directories
if (fs.existsSync(publicDir)) {
  fs.rmSync(publicDir, { recursive: true, force: true });
}
fs.mkdirSync(cssDir, { recursive: true });
fs.mkdirSync(jsDir, { recursive: true });

console.log('Building CSS with Sass...');
// Build app CSS
execSync('npx sass scss/styles.scss public/assets/css/one-page-parallax/app.min.css --style=compressed --no-source-map', { stdio: 'inherit' });

console.log('Creating vendor CSS bundle...');
// Concatenate vendor CSS files
const vendorCss = [
  'node_modules/animate.css/animate.min.css',
  'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
  'node_modules/pace-js/themes/black/pace-theme-flash.css',
  'node_modules/bootstrap-icons/font/bootstrap-icons.css'
].map(file => fs.readFileSync(path.join(__dirname, file), 'utf8')).join('\n');
fs.writeFileSync(path.join(cssDir, 'vendor.min.css'), vendorCss);

console.log('Creating vendor JS bundle...');
// Concatenate vendor JS files
const vendorJs = [
  'node_modules/pace-js/pace.min.js',
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
  'node_modules/paroller.js/dist/jquery.paroller.min.js',
  'node_modules/js-cookie/dist/js.cookie.js'
].map(file => {
  const filePath = path.join(__dirname, file);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}).filter(content => content).join('\n;\n');
fs.writeFileSync(path.join(jsDir, 'vendor.min.js'), vendorJs);

console.log('Copying app.js...');
fs.copyFileSync(
  path.join(__dirname, 'js', 'app.js'),
  path.join(jsDir, 'app.min.js')
);

console.log('Copying Font Awesome webfonts...');
const webfontsDir = path.join(assetsDir, 'css', 'webfonts');
fs.mkdirSync(webfontsDir, { recursive: true });
const fontFiles = fs.readdirSync(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'));
fontFiles.forEach(file => {
  fs.copyFileSync(
    path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts', file),
    path.join(webfontsDir, file)
  );
});

console.log('Copying Bootstrap Icons fonts...');
const bootstrapFontsDir = path.join(assetsDir, 'css', 'one-page-parallax', 'fonts');
fs.mkdirSync(bootstrapFontsDir, { recursive: true });
const bootstrapFontFiles = fs.readdirSync(path.join(__dirname, 'node_modules/bootstrap-icons/font/fonts'));
bootstrapFontFiles.forEach(file => {
  fs.copyFileSync(
    path.join(__dirname, 'node_modules/bootstrap-icons/font/fonts', file),
    path.join(bootstrapFontsDir, file)
  );
});

console.log('Copying and fixing HTML files...');
const htmlFiles = fs.readdirSync(path.join(__dirname, 'html'));
htmlFiles.forEach(file => {
  const srcPath = path.join(__dirname, 'html', file);
  if (fs.statSync(srcPath).isFile()) {
    let content = fs.readFileSync(srcPath, 'utf8');
    // Fix asset paths from ../assets to assets
    content = content.replace(/\.\.\/assets\//g, 'assets/');
    fs.writeFileSync(path.join(publicDir, file), content);
  }
});

console.log('Build complete! Output in public/ directory');


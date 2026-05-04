const fs = require('fs');
const path = 'c:/Users/cho/Desktop/진센조 프로젝트/api/web/public/images';
try {
  const files = fs.readdirSync(path);
  const target = files.find(f => {
    try {
      return fs.statSync(`${path}/${f}`).size === 1412369;
    } catch (e) { return false; }
  });
  if (target) {
    fs.renameSync(`${path}/${target}`, `${path}/logo.png`);
    console.log(`Success: Renamed ${target} to logo.png`);
  } else {
    console.log('Error: Target file with size 1412369 not found.');
  }
} catch (err) {
  console.error('Error reading directory:', err);
}

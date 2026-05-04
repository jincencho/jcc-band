const fs = require('fs');
const src = 'C:/Users/cho/.gemini/antigravity/brain/bba99947-493f-448b-9244-a48db80b71f3/jincencho_ultimate_logo_1777905882736.png';
const dest = 'c:/Users/cho/Desktop/진센조 프로젝트/api/web/public/images/logo.png';

try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Success: Ultimate logo applied.');
  } else {
    console.log('Error: Source file not found.');
  }
} catch (err) {
  console.error('Copy failed:', err);
}

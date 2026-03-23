const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Match `$48.00` literal and change to `₹48.00`
      content = content.replace(/\$(?=\d)/g, '₹');
      
      // Match `>${...}` literal in JSX and fix it
      content = content.replace(/>\$\{/g, '>₹{');
      
      // Match `-${...}` (like discount)
      content = content.replace(/-\$\{/g, '-₹{');
      
      // Some cases where `${...}` was mistakenly changed to `₹{`
      // Wait, we shouldn't indiscriminately change ₹{ back to ${ unless it's a URL or className
      content = content.replace(/`₹\{/g, '`${');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'frontend/src'));
console.log("Fixed Remaining.");

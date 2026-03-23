const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace $ followed by numbers or variables
      // match $ followed by digits: \$(\d+) -> ₹$1
      content = content.replace(/\$(\d+)/g, '₹$1');
      
      // match $ followed by string interpolation: \$\{ -> ₹${
      // wait, `$` alone before `${`
      // For instance: `${` -> don't touch unless it's `\$\{` representing currency. Wait, in TSX it's usually `${price}`.
      // So `$${` -> `₹${`
      content = content.replace(/\$\$\{/g, '₹${');
      
      // Also might have >$
      content = content.replace(/>\$/g, '>₹');
      // "price": "$"
      content = content.replace(/'\$/g, "'₹");
      content = content.replace(/"\$/g, '"₹');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'frontend/src'));
processDir(path.join(__dirname, 'backend/src'));
console.log("Done replacing currency symbols script.");

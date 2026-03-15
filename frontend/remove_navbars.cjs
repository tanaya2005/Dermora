const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    let original = content;
    // Remove Navbar import
    content = content.replace(/import\s*\{\s*Navbar\s*\}\s*from\s*['"]\.\.\/components\/Navbar['"];?\n?/g, '');

    // Remove <Navbar />
    content = content.replace(/<Navbar\s*\/>\s*/g, '');

    // Remove <header> ... </header>
    content = content.replace(/<header[\s\S]*?<\/header>\s*/g, '');

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${file}`);
    }
}

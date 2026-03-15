import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const fileMap = {
  'index.html': 'Home',
  'login_screen.html': 'Login',
  'assessment_screen.html': 'Assessment',
  'products_screen.html': 'Products',
  'product_details.html': 'ProductDetails',
  'checkout_screen.html': 'Checkout',
  'subscriptions.html': 'Subscriptions',
  'order_history.html': 'OrderHistory',
  'dermatologist.html': 'Dermatologist',
  'admin_dashboard.html': 'AdminDashboard',
  'inventory.html': 'Inventory'
};

function camelCase(str) {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

function nodeToJsx(node) {
  if (node.nodeType === 3) { // Text node
    return node.nodeValue.replace(/{/g, '{"{"}').replace(/}/g, '{"}"}');
  }
  if (node.nodeType === 8) { // Comment node
    return `{/* ${node.nodeValue.replace(/\*\//g, '* /')} */}`;
  }
  if (node.nodeType !== 1) return ''; // Only elements

  if (node.tagName.toLowerCase() === 'script') return '';

  const tagName = node.tagName.toLowerCase();
  let attrs = '';

  for (const attr of node.attributes) {
    let name = attr.name;
    let value = attr.value;

    if (name === 'class') name = 'className';
    else if (name === 'for') name = 'htmlFor';
    else if (name.startsWith('on')) continue; // remove inline handlers
    else if (name === 'style') {
      const styles = value.split(';').filter(Boolean).map(s => {
        let [k, ...vParts] = s.split(':');
        if (!k) return null;
        let v = vParts.join(':').trim();
        k = camelCase(k.trim());
        return `${k}: '${v.replace(/'/g, "\\'")}'`;
      }).filter(Boolean);
      attrs += ` style={{ ${styles.join(', ')} }}`;
      continue;
    } else if (name.includes('-')) {
      if (!name.startsWith('data-') && !name.startsWith('aria-')) {
        name = camelCase(name);
      }
    }
    
    if (name === 'viewbox') name = 'viewBox'; // special case
    if (name === 'tabindex') name = 'tabIndex'; // special case
    
    // escaping values
    value = value.replace(/"/g, '&quot;');
    attrs += ` ${name}="${value}"`;
  }

  const selfClosing = ['input', 'img', 'br', 'hr', 'source', 'link', 'meta'].includes(tagName);

  let childrenJsx = '';
  for (const child of node.childNodes) {
    childrenJsx += nodeToJsx(child);
  }

  if (selfClosing) {
    return `<${tagName}${attrs} />`;
  }
  return `<${tagName}${attrs}>${childrenJsx}</${tagName}>`;
}

const pagesDir = path.join('src', 'pages');
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

for (const [file, componentName] of Object.entries(fileMap)) {
  if (fs.existsSync(file)) {
    const html = fs.readFileSync(file, 'utf8');
    const dom = new JSDOM(html);
    const body = dom.window.document.body;

    let jsxContent = '';
    for (const child of body.childNodes) {
      jsxContent += nodeToJsx(child);
    }

    const fullCode = `import React from 'react';
import { Link } from 'react-router-dom';

export default function ${componentName}() {
  return (
    <>
      ${jsxContent}
    </>
  );
}
`;
    fs.writeFileSync(path.join(pagesDir, `${componentName}.tsx`), fullCode);
    console.log(`Converted ${file} to ${componentName}.tsx`);
  }
}

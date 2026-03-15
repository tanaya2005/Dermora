import fs from 'fs';
import path from 'path';

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

const selfClosingTags = ['input', 'img', 'br', 'hr', 'source', 'link', 'meta'];

function convertHtmlToJsx(html) {
  // Extract content inside <body> or use full if no body
  let bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : html;

  // Remove scripts
  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  content = content.replace(/class=/g, 'className=');
  content = content.replace(/for=/g, 'htmlFor=');
  
  // Convert standard SVG attributes
  const svgAttrs = [
    'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule', 'viewBox'
  ];
  svgAttrs.forEach(attr => {
    const camelCase = attr.replace(/-([a-z])/g, g => g[1].toUpperCase());
    const re = new RegExp(`\\b${attr}=`, 'gi');
    content = content.replace(re, `${camelCase}=`);
  });
  
  // viewBox needs exact case matching viewBox=
  content = content.replace(/viewbox=/gi, 'viewBox=');
  
  // inline handlers
  content = content.replace(/onclick="[^"]*"/gi, '');
  content = content.replace(/onchange="[^"]*"/gi, '');
  content = content.replace(/onsubmit="[^"]*"/gi, '');

  // fix self-closing tags
  selfClosingTags.forEach(tag => {
    const re = new RegExp(`<${tag}\\b([^>]*?)>`, 'gi');
    content = content.replace(re, (match, attrs) => {
      // If already closed, leave it
      if (attrs.trim().endsWith('/')) {
        return match;
      }
      return `<${tag}${attrs} />`;
    });
  });

  // comments
  content = content.replace(/<\!--[\s\S]*?-->/g, '{/* removed comment */}');

  // inline styles
  content = content.replace(/style="([^"]*)"/g, (match, styleString) => {
    const styles = styleString.split(';').filter(Boolean).map(s => {
      let [key, val] = s.split(':');
      if (!key || !val) return null;
      key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      val = val.trim();
      return `${key}: '${val}'`;
    }).filter(Boolean);
    return `style={{ ${styles.join(', ')} }}`;
  });

  return content;
}

const pagesDir = path.join('src', 'pages');
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

for (const [file, componentName] of Object.entries(fileMap)) {
  if (fs.existsSync(file)) {
    const html = fs.readFileSync(file, 'utf8');
    let jsxContent = convertHtmlToJsx(html);
    
    // Very naive way to wrap it
    // We should also ensure there's a single root element
    const fullCode = `import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ${componentName}() {
  return (
    <>
      ${jsxContent}
    </>
  );
}
`;
    // We can replace anchor tags that link locally, but for simplicity we keep it as is, or run auto fix.
    fs.writeFileSync(path.join(pagesDir, `${componentName}.tsx`), fullCode);
    console.log(`Converted ${file} to ${componentName}.tsx`);
  }
}

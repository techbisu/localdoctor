const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add newline after 'use client' / 'use server'
  content = content.replace(/('use (client|server)')(import|export|const|let|var|type|interface|async|function|class)/g, "$1\n$3");

  // 2. Add newline between import statements
  content = content.replace(/(from '[^']+')(import\s)/g, "$1\n$2");
  content = content.replace(/(import '[^']+')(import\s)/g, "$1\n$2");

  // 3. Add newline after imports before code
  content = content.replace(/(from '[^']+')(export\s|const\s|let\s|var\s|type\s|interface\s|async\s|function\s|class\s)/g, "$1\n$2");
  content = content.replace(/(import '[^']+')(export\s|const\s|let\s|var\s|type\s|interface\s|async\s|function\s|class\s)/g, "$1\n$2");

  // 4. Add newline after } before keywords
  content = content.replace(/(\})(export\s|const\s|let\s|var\s|type\s|interface\s|async\s|function\s|class\s)/g, "$1\n$2");

  // 5. Add newline after ) before keywords (function calls ending)
  content = content.replace(/(\))(export\s|const\s|let\s|var\s|type\s|interface\s|async\s|function\s|class\s)(?!\w)/g, "$1\n$2");

  // 6. Add newline after ; before keywords
  content = content.replace(/(;)(export\s|const\s|let\s|var\s|type\s|interface\s|async\s|function\s|class\s)/g, "$1\n$2");

  // 7. Add newline between closing braces
  content = content.replace(/(\})(\})/g, "$1\n$2");

  // 8. Add newline before return, if, switch, try, catch, finally when preceded by }
  content = content.replace(/(\})(return|if\s|switch\s|try\s|catch\s|finally\s)/g, "$1\n$2");

  // 9. Add newline after { before const/let/var/return/if
  content = content.replace(/(\{\s*)(const\s|let\s|var\s|return|if\s|await\s)/g, "{\n$2");

  // 10. Add newline before async function declarations
  content = content.replace(/(\S)(async\s+function\s)/g, "$1\n$2");

  fs.writeFileSync(filePath, content);
}

function walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      walkDir(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      fixFile(fullPath);
    }
  }
}

walkDir('./src');
console.log('Done. All files reformatted.');

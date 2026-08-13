const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add newline between statements: ) followed by space(s) then keyword
  content = content.replace(/(\))\s+(const\s|let\s|var\s|if\s|return\s|await\s|async\s|export\s|import\s|type\s|interface\s|function\s|class\s|switch\s|try\s|catch\s|finally\s|throw\s)/g, "$1\n$2");

  // Add newline between statements: } followed by space(s) then keyword
  content = content.replace(/(\})\s+(const\s|let\s|var\s|if\s|return\s|await\s|async\s|export\s|import\s|type\s|interface\s|function\s|class\s|switch\s|try\s|catch\s|finally\s|throw\s)/g, "$1\n$2");

  // Add newline between statements: ; followed by space(s) then keyword
  content = content.replace(/(;)(const\s|let\s|var\s|if\s|return\s|await\s|async\s|export\s|import\s|type\s|interface\s|function\s|class\s|switch\s|try\s|catch\s|finally\s|throw\s)/g, "$1\n$2");

  // Add newline after { before const/let/var/return/if/await
  content = content.replace(/(\{\s*)(const\s|let\s|var\s|return\s|if\s|await\s|throw\s)/g, "{\n$2");

  // Add newline before JSX tags: > followed by <
  content = content.replace(/(>)\s*(<[a-zA-Z])/g, "$1\n$2");

  // Add newline after JSX closing: </...> followed by < or { or text
  content = content.replace(/(<\/[a-zA-Z][^>]*>)\s*(<[a-zA-Z]|\{|\w)/g, "$1\n$2");

  // Add newline after ) when followed by { (arrow functions, if blocks)
  content = content.replace(/(\))\s*(\{)/g, "$1 $2");

  // Add newline between ) and => 
  content = content.replace(/(\))\s*(=>)/g, "$1 $2");

  // Add newline between statements inside JSX: ) followed by {
  content = content.replace(/(\))\s*(\{[^}])/g, "$1\n$2");

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

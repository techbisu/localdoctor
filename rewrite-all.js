const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function formatFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Use TypeScript parser to get the AST
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
  
  // Create a printer that adds newlines
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  
  // Print the source file
  const result = printer.printFile(sourceFile);
  
  fs.writeFileSync(filePath, result);
  console.log('✓', filePath);
}

function walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      walkDir(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      try {
        formatFile(fullPath);
      } catch (e) {
        console.error('✗', fullPath, e.message);
      }
    }
  }
}

walkDir('./src');
console.log('Done.');
